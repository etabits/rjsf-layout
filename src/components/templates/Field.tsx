import { useContext } from "react";
import { getDefaultRegistry } from "@rjsf/core";
import { TemplatesType } from "@rjsf/utils";

import PropsContext from "../../contexts/Props";
import LayoutContext from "../../contexts/Layout";
import DisplayLayout from "../../utils/DisplayLayout";

const DefaultFieldTemplate = getDefaultRegistry().templates["FieldTemplate"];

const FieldTemplate: TemplatesType["FieldTemplate"] = (props) => {
  const { theme, overrides, layout } = useContext(LayoutContext);
  const RegFieldTemplate =
    theme?.templates?.["FieldTemplate"] || DefaultFieldTemplate;

  const { label } = overrides || {};
  if (typeof label !== "undefined") {
    // FIXME this should be done without mutating things directly,
    // but overriding props.schema does not work!
    props.schema.title = label;
  }

  if (
    typeof layout === "function" &&
    !["array", "object"].includes(props.schema.type as string)
  ) {
    const { formData, onChange, id } = props;
    const fieldName = id.split("_").pop() || "data";
    return (
      <>
        {DisplayLayout({
          layout: layout({
            ["$" + fieldName]: formData,
            ["set" + fieldName[0].toUpperCase() + fieldName.substring(1)]:
              onChange,
            ...props,
          }),
        })}
      </>
    );
  }

  return (
    <PropsContext.Provider value={props}>
      <RegFieldTemplate {...props} />
    </PropsContext.Provider>
  );
};

export default FieldTemplate;
