import { ReactNode } from "react";
import RJSFForm, { FormProps } from "@rjsf/core";

import type { FieldChildren } from "./types";
import LayoutContext from "./contexts/Layout";
import FieldTemplate from "./templates/Field";
import ObjectFieldTemplate from "./templates/ObjectField";

const Form: React.FC<
  {
    children?: FieldChildren;
    submitter?: ReactNode;
  } & FormProps
> = ({ children, submitter, ...props }) => {
  const newProps = {
    ...props,
  } satisfies FormProps;

  if (!children) {
    return <RJSFForm {...newProps}>{submitter}</RJSFForm>;
  }

  return (
    <LayoutContext.Provider
      value={{
        layout: children,
      }}
    >
      <RJSFForm
        {...{
          ...newProps,
          templates: {
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
