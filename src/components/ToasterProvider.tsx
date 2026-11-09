"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export function ToasterProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme={theme === "dark" ? "dark" : "light"}
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "12px",
          fontFamily: "inherit",
        },
      }}
    />
  );
}
