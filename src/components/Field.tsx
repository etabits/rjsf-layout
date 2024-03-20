import { useContext } from "react";

import FieldsContext from "../contexts/Fields";
import LayoutContext from "../contexts/Layout";
import type { GenericBasicTypedFieldProps } from "../types";

const Field: React.FC<GenericBasicTypedFieldProps> = ({
  name,
  children,
  label,
  ArrayTemplate,
}) => {
  const fields = useContext(FieldsContext);
  const Field = fields?.find((props) => props.name === name)?.content;

  if (!Field) {
    // CHKME should we provide error boundaries at array/object levels?
    throw new Error(
      `RJSFLayout: No such field: "${name}". Available fields: ${fields
        ?.map((f) => f.name)
        .join(
          ", "
        )}. If field exists on model, please add it to the select tree. Alternatively, if you are trying to invoke the field inside a field other than its direct parent, move it out!`
    );
  }

  const inheritedLayoutProps = useContext(LayoutContext);

  return (
    <LayoutContext.Provider
      value={{
        ...inheritedLayoutProps,
        layout: children,
        overrides: {
          label,
        },
        ArrayTemplate,
      }}
    >
      {Field}
    </LayoutContext.Provider>
  );
};

export default Field;
