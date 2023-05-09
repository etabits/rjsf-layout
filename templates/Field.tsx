import { useContext } from "react";
import { getDefaultRegistry } from "@rjsf/core";
import { TemplatesType } from "@rjsf/utils";

import PropsContext from "../contexts/Props";
import LayoutContext from "../contexts/Layout";

const DefaultFieldTemplate = getDefaultRegistry().templates["FieldTemplate"];

const FieldTemplate: TemplatesType["FieldTemplate"] = (props) => {
  const { theme } = useContext(LayoutContext);
  const RegFieldTemplate =
    theme?.templates?.["FieldTemplate"] || DefaultFieldTemplate;

  return (
    <PropsContext.Provider value={props}>
      <RegFieldTemplate {...props} />
    </PropsContext.Provider>
  );
};

export default FieldTemplate;
