import type { FormProps, ThemeProps } from "@rjsf/core";
import type {
  FieldProps,
  FieldTemplateProps,
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
  SD SetData
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
      } & NamedFields<S, D> &
        ExpandedDataProps<S, D>
    >;

type ExpandedDataProps<
  S extends JSONSchemaObject,
  D extends BasicDataObject
> = keyof S["properties"] extends string
  ? D extends Record<any, any>
    ? {
        [$FN in `$${keyof S["properties"]}`]: $FN extends `$${infer FN}`
          ? D[FN]
          : never;
      }
    : never
  : never;

type NamedDataProps<
  Props extends { formData?: unknown; onChange?: unknown },
  FN extends string
> = Omit<Props, "formData" | "onChange"> & {
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
      [FN in Capitalize<keyof S["properties"]>]: React.FC<
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
    }
  : never;

type TypedFieldProps<
  S extends JSONSchemaObject,
  D extends BasicDataObject,
  FN extends keyof S["properties"]
> = {
  label?: string;
  name: FN;
  children?: D extends Record<any, any> // We should have nested data here!
    ? FN extends string
      ? S["properties"][FN] extends {
          items: infer IS;
        }
        ? SmartFieldChildren<
            IS extends JSONSchemaObject ? IS : never,
            NonNullable<D[FN]> extends Array<infer I> ? I : D[FN]
          >
        : React.FC<
            S["properties"][FN] extends { type: "object" }
              ? NamedFields<S["properties"][FN], D[FN]> &
                  ObjectFieldTemplateProps<D[FN]> &
                  ExpandedDataProps<S["properties"][FN], D[FN]>
              : NamedDataProps<
                  // pending react-jsonschema-form#3873
                  Omit<FieldTemplateProps<D[FN]>, "onChange"> & {
                    onChange: FieldProps<D[FN]>["onChange"];
                  },
                  FN
                >
          >
      : never
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
