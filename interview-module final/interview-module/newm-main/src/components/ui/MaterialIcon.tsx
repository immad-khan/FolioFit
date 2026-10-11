"use client";

import React from "react";

interface MaterialIconProps {
  name: string;
  size?: number;
  weight?: number;
  fill?: boolean;
  grade?: number;
  className?: string;
}

export function MaterialIcon({
  name,
  size = 24,
  weight = 400,
  fill = false,
  grade = 0,
  className = "",
}: MaterialIconProps) {
  const styles: React.CSSProperties = {
    fontSize: size,
    fontWeight: weight,
    fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${Math.max(20, Math.min(48, size))}`,
  };

  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={styles}
    >
      {name}
    </span>
  );
}
