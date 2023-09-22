import React, { useContext, useMemo } from "react";
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

  // If we don't memoize this, these new named fields get re-rendered!
  const namedFields = useMemo(
    () =>
      Object.fromEntries(
        props.properties.map(({ name }) => [
          name[0].toUpperCase() + name.substring(1),
          (props: Record<string, any>) =>
            React.createElement(Field, {
              // @ts-ignore it is, arguably, never never!
              name,
              ...props,
            }),
        ])
      ),
    []
  );

  const expandedLayout =
    typeof layout === "function"
      ? layout({
          ...props,
          ...Object.fromEntries(
            props.properties.map(({ name }) => [
              `$${name}`,
              props.formData?.[name],
            ])
          ),
          ...namedFields,
          // The generic, typed, field. Useful for programmatic access
          Field,
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
