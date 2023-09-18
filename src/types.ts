import type { FormProps, ThemeProps } from "@rjsf/core";
import type { TemplatesType } from "@rjsf/utils";
import type { ReactNode } from "react";
import type { FromSchema as FromSchema_, JSONSchema } from "json-schema-to-ts";

export type FromSchema<T extends JSONSchemaObject> = FromSchema_<
  T & { additionalProperties: false }
>;
export type JSONSchemaObject = Exclude<JSONSchema, boolean>;

type BasicReactNode =
  | React.ReactElement
  | string
  | (React.ReactElement | string)[];

export type FieldChildren = BasicReactNode | TemplatesType["FieldTemplate"];

export type SmartFieldChildren<T extends JSONSchemaObject> =
  | BasicReactNode
  | ((helpers: {
      Field: TypedField<T>;
      formData: FromSchema<T>;
    }) => BasicReactNode);

type TypedFieldProps<
  SCH extends JSONSchemaObject,
  FN extends keyof SCH["properties"]
> = {
  label?: string;
  name: FN;
  children?: SmartFieldChildren<
    SCH["properties"][FN] extends {
      items: any;
    }
      ? SCH["properties"][FN]["items"]
      : never
  >;
};

export type TypedField<SCH extends JSONSchemaObject> = <
  FN extends keyof SCH["properties"]
>(
  props: TypedFieldProps<SCH, FN>
) => React.ReactElement;

type OnAction<T extends JSONSchemaObject, C extends "onSubmit" | "onChange"> = (
  data: Omit<Parameters<NonNullable<FormProps[C]>>[0], "formData"> & {
    formData?: FromSchema<T>;
  },
  etc: Parameters<NonNullable<FormProps[C]>>[1]
) => void;

export type LayoutFormProps<T extends JSONSchemaObject> = Omit<
  FormProps,
  "children" | "onSubmit" | "onChange" | "formData"
> & {
  schema: T;
  children?: SmartFieldChildren<T>;
  submitter?: ReactNode;
  theme?: ThemeProps;
  formData?: FromSchema<T>;
  onSubmit?: OnAction<T, "onSubmit">;
  onChange?: OnAction<T, "onChange">;
};
