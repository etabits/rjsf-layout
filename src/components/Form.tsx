import DefaultForm, { type FormProps, withTheme } from "@rjsf/core";

import type { JSONSchemaObject, LayoutFormProps } from "../types";
import LayoutContext from "../contexts/Layout";
import FieldTemplate from "./templates/Field";
import ObjectFieldTemplate from "./templates/ObjectField";

const Form = <T extends JSONSchemaObject>({
  children,
  submitter,
  theme,
  ...props
}: LayoutFormProps<T>) => {
  const rjsfProps = props as FormProps;
  const RJSFForm = theme ? withTheme(theme) : DefaultForm;

  if (!children) {
    return <RJSFForm {...rjsfProps}>{submitter}</RJSFForm>;
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
          ...rjsfProps,

          templates: {
            ...theme?.templates,
            FieldTemplate,
            ObjectFieldTemplate,
            ...rjsfProps.templates,
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
