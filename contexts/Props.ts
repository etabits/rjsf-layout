import { createContext } from "react";
import type { FieldTemplateProps } from "@rjsf/utils";

const PropsContext = createContext<FieldTemplateProps | null>(null);

export default PropsContext;
