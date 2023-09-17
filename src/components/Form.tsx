import DefaultForm, { withTheme } from "@rjsf/core";

import type { LayoutFormProps } from "../types";
import LayoutContext from "../contexts/Layout";
import FieldTemplate from "./templates/Field";
import ObjectFieldTemplate from "./templates/ObjectField";
import type { JSONSchema7 } from "json-schema";

const Form = <T extends JSONSchema7>({
  children,
  submitter,
  theme,
  ...props
}: LayoutFormProps<T>) => {
  const RJSFForm = theme ? withTheme(theme) : DefaultForm;

  if (!children) {
    return <RJSFForm {...props}>{submitter}</RJSFForm>;
  }

  return (
    <LayoutContext.Provider
      value={{
        // @ts-ignore FIXME
        layout: children,
        theme,
      }}
    >
      <RJSFForm
        {...{
          ...props,
          templates: {
            ...theme?.templates,
            FieldTemplate,
            ObjectFieldTemplate,
            ...props.templates,
          },
          // CHKME should we do this merge? or is it redundant?
          widgets: {
            ...theme?.widgets,
            ...props.widgets,
          },
        }}
      >
        {submitter}
      </RJSFForm>
    </LayoutContext.Provider>
  );
};

export default Form;
