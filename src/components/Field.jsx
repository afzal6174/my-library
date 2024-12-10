import React from "react";

const Field = ({ children, error = null, ...containerProps }) => {
  const { label, htmlFor, id } = parseChildren(children);

  const resolvedId = id || htmlFor || toKebabCase(label?.props?.children || "");

  const updatedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === "label") {
      return React.cloneElement(child, {
        htmlFor: resolvedId,
      });
    }
    return React.cloneElement(child, {
      id: resolvedId,
    });
  });

  return (
    <div {...containerProps}>
      {updatedChildren}
      {!!error && <div aria-describedby={resolvedId}>{error}</div>}
    </div>
  );
};

// utility function for react
const parseChildren = (children) => {
  const parsed = {
    label: null,
    htmlFor: null,
    id: null,
  };

  let nonLabelNodes = 0;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === "label") {
      if (parsed.label) {
        throw new Error("Field component can have only one label child.");
      }
      parsed.label = child;
      parsed.htmlFor = child?.props?.htmlFor;
    } else {
      nonLabelNodes++;
      if (nonLabelNodes > 1) {
        throw new Error(
          "Field component must have exactly one non label child."
        );
      }
      const id = getChildId(child);
      if (id) {
        parsed.id = id;
      }
    }
  });

  if (nonLabelNodes < 1) {
    throw new Error("Field component must have exactly one non label child.");
  }

  return parsed;
};

const getChildId = (child) => {
  if (!child.props) return null;
  if ("id" in child.props) {
    return child?.props?.id;
  }
  return null;
};

// utility function to convert text to kebab-case for IDs
const toKebabCase = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// Prop validation

export default Field;
