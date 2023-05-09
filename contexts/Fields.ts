import { createContext } from "react";
import type { ObjectFieldTemplateProps } from "@rjsf/utils";

const FieldsContext = createContext<
  ObjectFieldTemplateProps["properties"] | null
>(null);

export default FieldsContext;
