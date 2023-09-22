import { ReactNode, useContext } from "react";

import FieldsContext from "../contexts/Fields";
import LayoutContext from "../contexts/Layout";

const Field: React.FC<{
  name: string;
  label?: string;
  // While it technically accepts component children (as TypedField),
  // it is meaningless unless you are using the typed version
  children?: ReactNode;
}> = ({ name, children, label }) => {
  const fields = useContext(FieldsContext);
  const Field = fields?.find((props) => props.name === name)?.content;

  if (!Field) {
    // CHKME should we provide error boundaries at array/object levels?
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
