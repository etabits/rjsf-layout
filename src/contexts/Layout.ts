import { createContext } from "react";
import type { ThemeProps } from "@rjsf/core";
import type { UiSchema } from "@rjsf/utils";
import { ArrayTemplateOverride } from "../types";

const LayoutContext = createContext<{
  layout?: any; // should actually be SmartFieldChildren<JSONSchemaObject>; but it is breaking typing (sth deep!)
  theme?: ThemeProps;
  uiSchema?: UiSchema;
  overrides?: {
    label?: string;
  };
  ArrayTemplate?: ArrayTemplateOverride<[]>;
}>({});

export default LayoutContext;
