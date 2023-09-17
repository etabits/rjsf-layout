import { useContext } from "react";

import type { TypedField } from "../types";
import FieldsContext from "../contexts/Fields";
import LayoutContext from "../contexts/Layout";

const Field: TypedField<{}> = ({ name, children, label }) => {
  const fields = useContext(FieldsContext);
  const Field = fields?.find((props) => props.name === name)?.content;

  if (!Field) {
    throw new Error(
      `RJSFLayout: No such field: "${name}". Available fields: ${fields
        ?.map((f) => f.name)
        .join(", ")}`
    );
  }

  const inheritedLayoutProps = useContext(LayoutContext);

  return (
    <LayoutContext.Provider
      value={{
        ...inheritedLayoutProps,
        // @ts-ignore FIXME
        layout: children,
        overrides: {
          label,
        },
      }}
    >
      {Field}
    </LayoutContext.Provider>
  );
};

export default Field;
