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

  // XXX extract into a function that does additional sanity checks
  const type = Array.isArray(props.schema.type)
    ? props.schema.type.find((item) => item !== "null")
    : props.schema.type;

  if (
    typeof layout === "function" &&
    !["array", "object"].includes(type as string)
  ) {
    // Handle leaves, i.e. scalar fields. These can provide custom fields as implementation,
    // They only get one variable and one setter for that variable
    const { formData, onChange, id } = props;
    const fieldName = id.split("_").pop() || "data";
    return (
      // CHKME removing the wrapping produces an error
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
