import type { FormProps, ThemeProps } from "@rjsf/core";
import type { TemplatesType } from "@rjsf/utils";
import type { ReactNode } from "react";
import type { JSONSchema7 } from "json-schema";

type BasicReactNode =
  | React.JSX.Element
  | string
  | (React.JSX.Element | string)[];

export type FieldChildren = BasicReactNode | TemplatesType["FieldTemplate"];

export type SmartFieldChildren<T extends JSONSchema7> =
  | BasicReactNode
  | ((helpers: { Field: TypedField<T> }) => BasicReactNode);

export type TypedField<SCH extends JSONSchema7> = <
  FN extends keyof SCH["properties"]
>(props: {
  label?: string;
  name: FN;
  children?: SmartFieldChildren<
    SCH["properties"][FN] extends { items: any }
      ? SCH["properties"][FN]["items"]
      : never
  >;
}) => React.JSX.Element;

export type LayoutFormProps<T extends JSONSchema7> = Omit<
  FormProps,
  "children"
> & {
  schema: T;
  children?: SmartFieldChildren<T>;
  submitter?: ReactNode;
  theme?: ThemeProps;
};
