import { useContext } from "react";
import { TemplatesType } from "@rjsf/utils";
import { getDefaultRegistry } from "@rjsf/core";

import LayoutContext from "../../contexts/Layout";
import FieldsContext from "../../contexts/Fields";
import DisplayLayout from "../../utils/DisplayLayout";
import Field from "../Field";

const DefaultObjectFieldTemplate =
  getDefaultRegistry().templates["ObjectFieldTemplate"];

const ObjectFieldTemplate: TemplatesType["ObjectFieldTemplate"] = (props) => {
  const { layout, theme } = useContext(LayoutContext);

  const RegObjectFieldTemplate =
    theme?.templates?.["ObjectFieldTemplate"] || DefaultObjectFieldTemplate;

  const expandedLayout =
    typeof layout === "function"
      ? layout({
          Field,
          formData: props.formData,
        })
      : layout;

  return expandedLayout ? (
    <FieldsContext.Provider value={props.properties}>
      {DisplayLayout({ layout: expandedLayout })}
    </FieldsContext.Provider>
  ) : (
    <RegObjectFieldTemplate {...props} />
  );
};

export default ObjectFieldTemplate;
