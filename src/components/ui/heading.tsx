import React from "react";

interface HeadingProps {
  title: string;
  description?: string;
}

/**
 * Heading component for page titles with optional description
 * 
 * @param title - The main heading text
 * @param description - Optional description text
 */
export const Heading: React.FC<HeadingProps> = ({
  title,
  description,
}) => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">
          {description}
        </p>
      )}
    </div>
  );
};
