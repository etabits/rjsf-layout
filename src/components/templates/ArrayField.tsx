import { useContext } from "react";
import { TemplatesType } from "@rjsf/utils";
import { getDefaultRegistry } from "@rjsf/core";

import LayoutContext from "../../contexts/Layout";
import PropsContext from "../../contexts/Props";

const DefaultArrayFieldTemplate =
  getDefaultRegistry().templates["ArrayFieldTemplate"];

const ArrayFieldTemplate: TemplatesType["ArrayFieldTemplate"] = (props) => {
  const { ArrayTemplate, theme } = useContext(LayoutContext);

  // FIXME upstream Field should pass enhancing props in layout context
  // with overridden label probably
  const enhancedProps = ArrayTemplate
    ? {
        ...props,
        onChange: useContext(PropsContext)?.onChange,
      }
    : props;

  const RegArrayFieldTemplate =
    ArrayTemplate ||
    theme?.templates?.["ArrayFieldTemplate"] ||
    DefaultArrayFieldTemplate;

  return <RegArrayFieldTemplate {...enhancedProps} />;
};

export default ArrayFieldTemplate;
