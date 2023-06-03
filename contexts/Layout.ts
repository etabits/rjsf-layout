import { createContext } from "react";
import type { ThemeProps } from "@rjsf/core";
import type { UiSchema } from "@rjsf/utils";

import type { SmartFieldChildren } from "../types";
import type { JSONSchema7 } from "json-schema";

const LayoutContext = createContext<{
  layout?: SmartFieldChildren<JSONSchema7>;
  theme?: ThemeProps;
  uiSchema?: UiSchema;
}>({});

export default LayoutContext;
