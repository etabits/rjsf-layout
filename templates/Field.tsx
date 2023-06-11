import { useContext } from "react";
import { getDefaultRegistry } from "@rjsf/core";
import { TemplatesType } from "@rjsf/utils";

import PropsContext from "../contexts/Props";
import LayoutContext from "../contexts/Layout";

const DefaultFieldTemplate = getDefaultRegistry().templates["FieldTemplate"];

const FieldTemplate: TemplatesType["FieldTemplate"] = (props) => {
  const { theme, overrides } = useContext(LayoutContext);
  const RegFieldTemplate =
    theme?.templates?.["FieldTemplate"] || DefaultFieldTemplate;

  const { label } = overrides || {};
  if (label) {
    // FIXME this should be done without mutating things directly,
    // but overriding props.schema does not work!
    props.schema.title = label;
  }

  return (
    <PropsContext.Provider value={props}>
      <RegFieldTemplate {...props} />
    </PropsContext.Provider>
  );
};

export default FieldTemplate;
