import React from "react";

interface ColorToken {
  classBg: string;
  variable: string;
  hex: string;
  opacity?: string;
}

interface ColorGroup {
  category: string;
  colors: ColorToken[];
}

export const colorData: ColorGroup[] = [
  {
    category: "Basic",
    colors: [
      {classBg: "bg-basic-00", variable: "--basic-00", hex: "#FFFFFF"},
      {classBg: "bg-basic-00-05", variable: "--basic-00-05", hex: "#FFFFFF", opacity: "5%"},
      {classBg: "bg-basic-00-10", variable: "--basic-00-10", hex: "#FFFFFF", opacity: "10%"},
      {classBg: "bg-basic-200", variable: "--basic-200", hex: "#DADDF0"},
      {classBg: "bg-basic-300", variable: "--basic-300", hex: "#C3C6D7"},
      {classBg: "bg-basic-500", variable: "--basic-500", hex: "#8D90A0"},
      {classBg: "bg-basic-700", variable: "--basic-700", hex: "#32343D"},
      {classBg: "bg-basic-700-90", variable: "--basic-700-90", hex: "#32343D", opacity: "90%"},
      {classBg: "bg-basic-900", variable: "--basic-900", hex: "#1E1E1E"},
      {classBg: "bg-basic-940", variable: "--basic-940", hex: "#0A0F14"},
      {classBg: "bg-basic-950", variable: "--basic-950", hex: "#0A0E14"},
      {classBg: "bg-basic-950-60", variable: "--basic-950-60", hex: "#0A0E14", opacity: "60%"},
      {classBg: "bg-basic-960", variable: "--basic-960", hex: "#0C0E16"},
      {classBg: "bg-basic-960-80", variable: "--basic-960-80", hex: "#11131B", opacity: "80%"},
      {classBg: "bg-basic-960-90", variable: "--basic-960-90", hex: "#0C0E16", opacity: "90%"},
      {classBg: "bg-basic-970", variable: "--basic-970", hex: "#0A0A0A"},
    ],
  },
  {
    category: "Gray",
    colors: [
      {classBg: "bg-gray-100", variable: "--gray-100", hex: "#E1E2ED"},
      {classBg: "bg-gray-150", variable: "--gray-150", hex: "#C9CAD4"},
      {classBg: "bg-gray-200", variable: "--gray-200", hex: "#262626"},
      {classBg: "bg-gray-300", variable: "--gray-300", hex: "#171717"},
      {classBg: "bg-gray-400", variable: "--gray-400", hex: "#3B3B3B"},
    ],
  },
  {
    category: "Blue",
    colors: [
      {classBg: "bg-blue-50", variable: "--blue-50", hex: "#EEEFFF"},
      {classBg: "bg-blue-200", variable: "--blue-200", hex: "#B4C5FF"},
      {classBg: "bg-blue-200-30", variable: "--blue-200-30", hex: "#B4C5FF", opacity: "30%"},
      {classBg: "bg-blue-300", variable: "--blue-300", hex: "#A1B2ED"},
      {classBg: "bg-blue-400", variable: "--blue-400", hex: "#7F90C9"},
      {classBg: "bg-blue-700", variable: "--blue-700", hex: "#2563EB"},
      {classBg: "bg-blue-700-20", variable: "--blue-700-20", hex: "#2563EB", opacity: "20%"},
      {classBg: "bg-blue-900", variable: "--blue-900", hex: "#002A78"},
      {classBg: "bg-blue-1000", variable: "--blue-1000", hex: "#031F54"},
    ],
  },
  {
    category: "Red",
    colors: [
      {classBg: "bg-red-200", variable: "--red-200", hex: "#FFB4AB"},
      {classBg: "bg-red-300", variable: "--red-300", hex: "#FFB3AD"},
      {classBg: "bg-red-400", variable: "--red-400", hex: "#DB8C86"},
      {classBg: "bg-red-700", variable: "--red-700", hex: "#93000A"},
      {classBg: "bg-red-700-20", variable: "--red-700-20", hex: "#93000A", opacity: "20%"},
      {classBg: "bg-red-700-70", variable: "--red-700-70", hex: "#93000A", opacity: "70%"},
      {classBg: "bg-red-900", variable: "--red-900", hex: "#690005"},
    ],
  },
];

// Función helper para convertir HEX + Opacidad a color RGBA
const getRgbaColor = (hex: string, opacity?: string) => {
  if (!opacity) return hex;
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  const alpha = parseFloat(opacity) / 100;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const Colors = () => {
  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-900 transition-colors duration-200 dark:bg-[#0C0E16] dark:text-[#E1E2ED]">
      <h1 className="mb-2 text-3xl font-bold">Color System</h1>
      <p className="mb-8 text-gray-500 dark:text-[#8D90A0]">Foundations → Utility Tokens</p>

      {colorData.map((group) => (
        <div className="mb-20" key={group.category}>
          <h2 className="mb-4 border-b border-gray-200 pb-2 text-xl font-semibold dark:border-[#32343D]">
            {group.category}
          </h2>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {group.colors.map((color) => (
              <div
                className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm dark:border-[#262626] dark:bg-[#181826]"
                key={color.variable}
              >
                {/* Contenedor con patrón de ajedrez de fondo */}
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    backgroundImage: `repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%)`,
                    backgroundSize: "12px 12px",
                  }}
                  className="h-20 w-full border-b border-gray-200 dark:border-[#262626]"
                >
                  {/* Div superpuesto con el color y opacidad aplicada */}
                  <div
                    style={{
                      backgroundColor: getRgbaColor(color.hex, color.opacity),
                    }}
                    className="h-full w-full"
                  />
                </div>

                <div className="flex flex-col gap-1 p-3 text-xs">
                  <span className="font-bold text-gray-900 dark:text-white">{color.classBg}</span>
                  <span className="text-gray-600 dark:text-[#C9CAD4]">{color.variable}</span>
                  <span className="text-gray-400 dark:text-[#8D90A0]">
                    HEX: {color.hex} {color.opacity ? `(${color.opacity})` : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
