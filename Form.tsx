import DefaultForm, { FormProps, withTheme } from "@rjsf/core";

import type { LayoutFormProps } from "./types";
import LayoutContext from "./contexts/Layout";
import FieldTemplate from "./templates/Field";
import ObjectFieldTemplate from "./templates/ObjectField";

const Form = ({ children, submitter, theme, ...props }: LayoutFormProps) => {
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
        }}
      >
        {submitter}
      </RJSFForm>
    </LayoutContext.Provider>
  );
};

export default Form;
