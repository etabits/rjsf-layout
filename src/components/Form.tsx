import DefaultForm, { type FormProps, withTheme } from "@rjsf/core";

import type { JSONSchemaObject, LayoutFormProps } from "../types";
import LayoutContext from "../contexts/Layout";
import FieldTemplate from "./templates/Field";
import ObjectFieldTemplate from "./templates/ObjectField";
import ArrayFieldTemplate from "./templates/ArrayField";
import { useMemo } from "react";

const rjsfLayoutTemplates = {
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTemplate,
};

const Form = <S extends JSONSchemaObject>({
  children,
  submitter,
  theme: theme_,
  dontMemoize,
  ...props
}: LayoutFormProps<S>) => {
  const rjsfProps = props as FormProps;

  // Sorting out passed templates, if any
  // special templates (that are in rjsfLayoutTemplates)  are used to override theme's
  // other templates are passed as usual upstream to Form
  const overridingTemplates = {};
  const otherTemplates = {};
  if (rjsfProps.templates) {
    Object.entries(rjsfProps.templates).forEach(
      ([templateName, templateComponent]) =>
        // @ts-ignore
        ((templateName in rjsfLayoutTemplates
          ? overridingTemplates
          : otherTemplates)[templateName] = templateComponent)
    );
  }
  const theme = overridingTemplates
    ? {
        ...theme_,
        templates: {
          ...theme_?.templates,
          ...overridingTemplates,
        },
      }
    : theme_;

  const RJSFForm = useMemo(
    () => (theme ? withTheme(theme) : DefaultForm),
    [theme]
  );

  if (!children) {
    // FIXME need to apply theme stuff here!
    return <RJSFForm {...rjsfProps}>{submitter}</RJSFForm>;
  }

  const layout = useMemo(() => children, dontMemoize ? [children] : [-1]);
  const layoutContext = useMemo(
    () => ({
      layout,
      theme,
      dontMemoize,
    }),
    [layout, theme, dontMemoize]
  );

  return (
    <LayoutContext.Provider value={layoutContext}>
      <RJSFForm
        {...{
          ...rjsfProps,
          templates: {
            ...theme?.templates,
            ...rjsfLayoutTemplates,
            ...otherTemplates,
          },
          // CHKME should we do this merge? or is it redundant?
          widgets: {
            ...theme?.widgets,
            ...rjsfProps.widgets,
          },
        }}
      >
        {submitter}
      </RJSFForm>
    </LayoutContext.Provider>
  );
};

export default Form;
