import { getDefaultRegistry } from "@rjsf/core";
import { TemplatesType } from "@rjsf/utils";

import PropsContext from "../contexts/Props";

const RegFieldTemplate = getDefaultRegistry().templates["FieldTemplate"];

const FieldTemplate: TemplatesType["FieldTemplate"] = (props) => {
  return (
    <PropsContext.Provider value={props}>
      <RegFieldTemplate {...props} />
    </PropsContext.Provider>
  );
};

export default FieldTemplate;
