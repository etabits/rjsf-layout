import type { FormProps, ThemeProps } from "@rjsf/core";
import type {
  ArrayFieldTemplateProps,
  FieldProps,
  FieldTemplateProps,
  ObjectFieldTemplateProps,
  TemplatesType,
} from "@rjsf/utils";
import type { ComponentType, ReactNode } from "react";
import type { FromSchema as FromSchema_, JSONSchema } from "json-schema-to-ts";
import React from "react";

export type FromSchema<T extends JSONSchemaObject> = FromSchema_<
  T & { additionalProperties: false }
> &
  Record<string, unknown>;
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
  SD SetData
*/

export type SmartFieldChildren<
  S extends JSONSchemaObject,
  D extends BasicDataObject
> = BasicReactNode | TypedField<S, D>;

export type TypedField<
  S extends JSONSchemaObject,
  D extends BasicDataObject = FromSchema<S>
> = React.FC<TypedFieldProps<S, D>>;

export type TypedFieldProps<
  S extends JSONSchemaObject,
  D extends BasicDataObject
> = Omit<ObjectFieldTemplateProps<D>, "formData"> & {
  // Because array item data becomes undefined-able otherwise
  formData: Partial<D>;
} & NamedFields<S, D> &
  ExpandedDataProps<S, D>;

type ExpandedDataProps<
  S extends JSONSchemaObject,
  D extends BasicDataObject
> = keyof S["properties"] extends string
  ? D extends Record<any, any>
    ? {
        [$FN in `$${keyof S["properties"]}`]?: $FN extends `$${infer FN}`
          ? D[FN]
          : never;
      }
    : never
  : never;

type NamedDataProps<
  Props extends { formData?: unknown; onChange?: unknown },
  FN extends string
> = Props & {
  [FN_ in `$${FN}`]: Props["formData"];
} & (Props["onChange"] extends Function
    ? {
        [SD in `set${Capitalize<FN>}`]: Props["onChange"];
      }
    : {});

type NamedFields<
  S extends JSONSchemaObject,
  D extends BasicDataObject
> = keyof S["properties"] extends string
  ? {
      [FN in Capitalize<keyof S["properties"]>]: NamedField<S, FN, D>;
    } & { Field: BasicTypedField<S, D> }
  : {};

export type NamedField<
  S extends JSONSchemaObject,
  FN extends Capitalize<keyof S["properties"] & string>,
  D extends BasicDataObject = FromSchema<S>
> = React.FC<
  Omit<
    BasicTypedFieldProps<
      S,
      D,
      Uncapitalize<FN> extends keyof S["properties"] ? Uncapitalize<FN> : never
    >,
    "name"
  >
>;

export type ArrayTemplateOverride<D extends unknown[]> = ComponentType<
  ArrayFieldTemplateProps<D> & {
    // Added in templates/ArrayField
    onChange: FieldProps<D>["onChange"];
  }
>;

type BasicTypedFieldProps<
  S extends JSONSchemaObject,
  D extends BasicDataObject,
  FN extends keyof S["properties"],
  IS = S["properties"][FN] extends {
    items: infer IS_;
  }
    ? IS_
    : never,
  AT = IS extends JSONSchemaObject
    ? ArrayTemplateOverride<FromSchema<IS>[]>
    : never
> = {
  label?: string;
  name: FN;
  children?: D extends Record<any, any> // We should have nested data here!
    ? FN extends string
      ? S["properties"][FN] extends {
          items: infer IS;
        }
        ? // Array field
          SmartFieldChildren<
            IS extends JSONSchemaObject ? IS : never,
            NonNullable<D[FN]> extends Array<infer I> ? I : D[FN]
          >
        : React.FC<
            S["properties"][FN] extends { type: "object" }
              ? // Object field
                NamedFields<S["properties"][FN], D[FN]> &
                  ObjectFieldTemplateProps<D[FN]> &
                  ExpandedDataProps<S["properties"][FN], D[FN]>
              : // Scalar field
                NamedDataProps<
                  // pending react-jsonschema-form#3873
                  Omit<FieldTemplateProps<D[FN]>, "onChange"> & {
                    onChange: FieldProps<D[FN]>["onChange"];
                  },
                  FN
                >
          >
      : never
    : never;
} & ([IS] extends [{ type: "object" }]
  ? {
      ArrayTemplate?: AT;
    }
  : {});

export type BasicTypedField<
  S extends JSONSchemaObject,
  D extends BasicDataObject
> = <FN extends keyof S["properties"]>(
  props: BasicTypedFieldProps<S, D, FN>
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
> = Omit<
  FormProps,
  "schema" | "children" | "onSubmit" | "onChange" | "formData"
> & {
  schema: S;
  children?: SmartFieldChildren<S, D>;
  submitter?: ReactNode;
  theme?: ThemeProps;
  formData?: D;
  onSubmit?: OnAction<D, "onSubmit">;
  onChange?: OnAction<D, "onChange">;
};
