import type { FormProps, ThemeProps } from "@rjsf/core";
import type { TemplatesType } from "@rjsf/utils";
import type { ReactNode } from "react";
import type { JSONSchema7 } from "json-schema";
// CHKME use FromSchema from json-schema-to-ts instead?
// CHKME can we export the type at compile-time instead of depending on ajv?
import type { JTDDataType } from "ajv/dist/jtd";

type BasicReactNode =
  | React.ReactElement
  | string
  | (React.ReactElement | string)[];

export type FieldChildren = BasicReactNode | TemplatesType["FieldTemplate"];

export type SmartFieldChildren<T extends JSONSchema7> =
  | BasicReactNode
  | ((helpers: {
      Field: TypedField<T>;
      formData: JTDDataType<T>;
    }) => BasicReactNode);

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
}) => React.ReactElement;

type OnAction<T extends JSONSchema7, C extends "onSubmit" | "onChange"> = (
  data: Omit<Parameters<NonNullable<FormProps[C]>>[0], "formData"> & {
    formData?: JTDDataType<T>;
  },
  etc: Parameters<NonNullable<FormProps[C]>>[1]
) => void;

export type LayoutFormProps<T extends JSONSchema7> = Omit<
  FormProps,
  "children" | "onSubmit" | "onChange"
> & {
  schema: T;
  children?: SmartFieldChildren<T>;
  submitter?: ReactNode;
  theme?: ThemeProps;
  onSubmit?: OnAction<T, "onSubmit">;
  onChange?: OnAction<T, "onChange">;
};
