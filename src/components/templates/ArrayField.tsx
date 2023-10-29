import { useContext } from "react";
import type { TemplatesType } from "@rjsf/utils";
import { getDefaultRegistry } from "@rjsf/core";

import LayoutContext from "../../contexts/Layout";
import PropsContext from "../../contexts/Props";

const DefaultArrayFieldTemplate =
  getDefaultRegistry().templates["ArrayFieldTemplate"];

const ArrayFieldTemplate: TemplatesType["ArrayFieldTemplate"] = (props) => {
  const { ArrayTemplate, theme } = useContext(LayoutContext);

  if (ArrayTemplate) {
    const AT = ArrayTemplate as typeof DefaultArrayFieldTemplate;

    // FIXME upstream Field should pass enhancing props in layout context
    // with overridden label probably
    const onChange = useContext(PropsContext)?.onChange;

    return <AT {...{ ...props, onChange }} />;
  }

  const RegArrayFieldTemplate =
    theme?.templates?.["ArrayFieldTemplate"] || DefaultArrayFieldTemplate;

  return <RegArrayFieldTemplate {...props} />;
};

export default ArrayFieldTemplate;
