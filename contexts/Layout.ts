import { createContext } from "react";
import type { ThemeProps } from "@rjsf/core";
import type { UiSchema } from "@rjsf/utils";

import type { FieldChildren } from "../types";

const LayoutContext = createContext<{
  layout?: FieldChildren;
  theme?: ThemeProps;
  uiSchema?: UiSchema;
}>({});

export default LayoutContext;
