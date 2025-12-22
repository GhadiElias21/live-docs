// components/CustomToast.tsx
import React from "react";

interface CustomToastProps {
  message: string;
  type: "success" | "error";
}

const CustomToast: React.FC<CustomToastProps> = ({ message, type }) => {
  return (
    <div
      style={{
        padding: "12px 16px",
        color: "#fff",
        borderRadius: "8px",
        backgroundColor: type === "success" ? "#4CAF50" : "#F44336",
        display: "flex",
        alignItems: "center",
        fontWeight: 500,
      }}
    >
      {type === "success" ? "✅" : "❌"}
      <span style={{ marginLeft: 8 }}>{message}</span>
    </div>
  );
};

export default CustomToast;
