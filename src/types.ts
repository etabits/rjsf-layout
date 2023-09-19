import type { FormProps, ThemeProps } from "@rjsf/core";
import type {
  FieldProps,
  ObjectFieldTemplateProps,
  TemplatesType,
} from "@rjsf/utils";
import type { ReactNode } from "react";
import type { FromSchema as FromSchema_, JSONSchema } from "json-schema-to-ts";
import React from "react";

export type FromSchema<T extends JSONSchemaObject> = FromSchema_<
  T & { additionalProperties: false }
>;
export type JSONSchemaObject = Exclude<JSONSchema, boolean>;

type BasicReactNode =
  | React.ReactElement
  | string
  | (React.ReactElement | string)[];

export type FieldChildren = BasicReactNode | TemplatesType["FieldTemplate"];

/*
  Generics naming conventions:
  S  Schema
  D  Data
  FN Field Name
  I  Item
  IS ItemsSchema
*/

export type SmartFieldChildren<
  S extends JSONSchemaObject,
  D extends BasicDataObject
> =
  | BasicReactNode
  | React.FC<
      ObjectFieldTemplateProps<D> & {
        // Because array item data becomes undefined-able otherwise
        formData: Partial<D>;
      } & ExpandedFields<S, D>
    >;

type ExpandedFields<S extends JSONSchemaObject, D extends BasicDataObject> = {
  [FN in Capitalize<
    keyof S["properties"] extends string ? keyof S["properties"] : never
  >]: React.FC<
    Omit<
      TypedFieldProps<
        S,
        D,
        Uncapitalize<FN> extends keyof S["properties"]
          ? Uncapitalize<FN>
          : never
      >,
      "name"
    >
  >;
};

type TypedFieldProps<
  S extends JSONSchemaObject,
  D extends BasicDataObject,
  FN extends keyof S["properties"]
> = {
  label?: string;
  name: FN;
  children?: D extends Record<any, any> // We should have nested data here!
    ? S["properties"][FN] extends {
        items: infer IS;
      }
      ? SmartFieldChildren<
          IS extends JSONSchemaObject ? IS : never,
          NonNullable<D[FN]> extends Array<infer I> ? I : D[FN]
        >
      : React.FC<
          S["properties"][FN] extends { type: "object" }
            ? ExpandedFields<S["properties"][FN], D[FN]> &
                ObjectFieldTemplateProps<D[FN]>
            : FieldProps<D[FN]>
        >
    : never;
};

export type TypedField<
  S extends JSONSchemaObject,
  D extends BasicDataObject
> = <FN extends keyof S["properties"]>(
  props: TypedFieldProps<S, D, FN>
) => React.ReactElement;

type BasicDataObject = unknown;

type OnAction<D extends BasicDataObject, C extends "onSubmit" | "onChange"> = (
  data: Omit<Parameters<NonNullable<FormProps[C]>>[0], "formData"> & {
    formData?: D;
  },
  etc: Parameters<NonNullable<FormProps[C]>>[1]
) => void;

export type LayoutFormProps<
  S extends JSONSchemaObject,
  D = FromSchema<S> // We do this once at this top level, and pass it on
> = Omit<FormProps, "children" | "onSubmit" | "onChange" | "formData"> & {
  schema: S;
  children?: SmartFieldChildren<S, D>;
  submitter?: ReactNode;
  theme?: ThemeProps;
  formData?: D;
  onSubmit?: OnAction<D, "onSubmit">;
  onChange?: OnAction<D, "onChange">;
};
