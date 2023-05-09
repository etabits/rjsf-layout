import type { TemplatesType } from "@rjsf/utils";

export type FieldChildren =
  | React.JSX.Element
  | string
  | (React.JSX.Element | string)[]
  | TemplatesType["FieldTemplate"];
