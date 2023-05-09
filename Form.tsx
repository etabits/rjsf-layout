import { ReactNode } from "react";
import DefaultForm, { FormProps, ThemeProps, withTheme } from "@rjsf/core";

import type { FieldChildren } from "./types";
import LayoutContext from "./contexts/Layout";
import FieldTemplate from "./templates/Field";
import ObjectFieldTemplate from "./templates/ObjectField";

type LayoutFormProps = {
  children?: FieldChildren;
  submitter?: ReactNode;
  theme?: ThemeProps;
} & FormProps;

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
