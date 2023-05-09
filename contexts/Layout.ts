import { createContext } from "react";
import type { UiSchema } from "@rjsf/utils";

import type { FieldChildren } from "../types";

const LayoutContext = createContext<{
  layout?: FieldChildren;
  uiSchema?: UiSchema;
}>({});

export default LayoutContext;
