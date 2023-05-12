import type { FormProps, ThemeProps } from "@rjsf/core";
import type { TemplatesType } from "@rjsf/utils";
import type { ReactNode } from "react";

export type FieldChildren =
  | React.JSX.Element
  | string
  | (React.JSX.Element | string)[]
  | TemplatesType["FieldTemplate"];

export type LayoutFormProps = Omit<FormProps, "children"> & {
  children?: FieldChildren;
  submitter?: ReactNode;
  theme?: ThemeProps;
};
