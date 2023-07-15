import type { TemplatesType } from "@rjsf/utils";
import { useContext } from "react";
import LayoutContext from "../contexts/Layout";
import { getDefaultRegistry } from "@rjsf/core";
import DisplayLayout from "../utils/DisplayLayout";

const DefaultArrayFieldTemplate =
  getDefaultRegistry().templates["ArrayFieldTemplate"];

const ArrayFieldTemplate: TemplatesType["ArrayFieldTemplate"] = (props) => {
  const { layout, theme } = useContext(LayoutContext);

  const RegArrayFieldTemplate =
    theme?.templates?.["ArrayFieldTemplate"] || DefaultArrayFieldTemplate;

  const expandedLayout =
    typeof layout === "function"
      ? layout({
          Field,
          formData: props.formData,
        })
      : layout;

  return expandedLayout ? (
    DisplayLayout({ layout: expandedLayout })
  ) : (
    <RegArrayFieldTemplate {...props} />
  );
};

export default ArrayFieldTemplate;
