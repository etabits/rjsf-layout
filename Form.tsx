import DefaultForm, { FormProps, withTheme } from "@rjsf/core";

import type { LayoutFormProps } from "./types";
import LayoutContext from "./contexts/Layout";
import FieldTemplate from "./templates/Field";
import ObjectFieldTemplate from "./templates/ObjectField";
import type { JSONSchema7 } from "json-schema";

const Form = <T extends JSONSchema7>({
  children,
  submitter,
  theme,
  ...props
}: LayoutFormProps<T>) => {
  const newProps = {
    ...props,
  } satisfies FormProps;

  const RJSFForm = theme ? withTheme(theme) : DefaultForm;

  if (!children) {
    return <RJSFForm {...newProps}>{submitter}</RJSFForm>;
  }

  return (
    <LayoutContext.Provider
      value={{
        layout: children,
        theme,
      }}
    >
      <RJSFForm
        {...{
          ...newProps,
          templates: {
            ...theme?.templates,
            FieldTemplate,
            ObjectFieldTemplate,
            ...newProps.templates,
          },
          // CHKME should we do this merge? or is it redundant?
          widgets: {
            ...theme?.widgets,
            ...newProps.widgets,
          },
        }}
      >
        {submitter}
      </RJSFForm>
    </LayoutContext.Provider>
  );
};

export default Form;
