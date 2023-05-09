import { useContext } from "react";
import { TemplatesType } from "@rjsf/utils";
import { getDefaultRegistry } from "@rjsf/core";

import LayoutContext from "../contexts/Layout";
import FieldsContext from "../contexts/Fields";
import DisplayLayout from "../utils/DisplayLayout";

const RegObjectFieldTemplate =
  getDefaultRegistry().templates["ObjectFieldTemplate"];

const ObjectFieldTemplate: TemplatesType["ObjectFieldTemplate"] = (props) => {
  const { layout } = useContext(LayoutContext);
  return layout ? (
    <FieldsContext.Provider value={props.properties}>
      {DisplayLayout({ layout })}
    </FieldsContext.Provider>
  ) : (
    <RegObjectFieldTemplate {...props} />
  );
};

export default ObjectFieldTemplate;
