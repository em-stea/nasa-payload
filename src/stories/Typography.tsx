const fontWeights = [
  {name: "Regular", weight: "400", classWeight: "font-normal"},
  {name: "Medium", weight: "500", classWeight: "font-medium"},
  {name: "SemiBold", weight: "600", classWeight: "font-semibold"},
  {name: "Bold", weight: "700", classWeight: "font-bold"},
];

const typeStyles = [
  {
    name: "ALPHA",
    classSize: "text-4xl font-bold",
    sample: "The quick brown fox jumps over the lazy dog",
  },
  {
    name: "BETA",
    classSize: "text-3xl font-bold",
    sample: "The quick brown fox jumps over the lazy dog",
  },
  {
    name: "EPSILON",
    classSize: "text-2xl font-semibold",
    sample: "The quick brown fox jumps over the lazy dog",
  },
  {
    name: "DELTA",
    classSize: "text-xl font-semibold",
    sample: "The quick brown fox jumps over the lazy dog",
  },
  {
    name: "OMEGA",
    classSize: "text-base font-medium",
    sample: "The quick brown fox jumps over the lazy dog",
  },
  {
    name: "SIGMA",
    classSize: "text-xs font-bold uppercase tracking-wider",
    sample: "The quick brown fox jumps over the lazy dog",
  },
  {
    name: "PI",
    classSize: "text-sm font-normal",
    sample: "The quick brown fox jumps over the lazy dog",
  },
];

export const Typography = () => {
  return (
    <div className="min-h-screen bg-white p-8 font-sans text-gray-900 transition-colors duration-200 dark:bg-[#0C0E16] dark:text-[#E1E2ED]">
      <h1 className="mb-2 text-3xl font-bold">Typography</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-[#8D90A0]">
        Our Design System uses Space Grotesk as the primary font and JetBrains Mono for code blocks
        and secondary tokens.
      </p>

      {/* Tarjetas de Fuentes Locales */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-center justify-around rounded-xl border border-gray-200 bg-gray-50 p-6 text-gray-900 md:col-span-2 dark:border-transparent dark:bg-white">
          <div className="text-center font-sans">
            <span className="mb-2 block text-4xl font-bold">Aa</span>
            <span className="block text-xs text-gray-500">Primary Font</span>
            <span className="text-xs font-semibold">Space Grotesk</span>
          </div>
          <div className="text-center font-mono">
            <span className="mb-2 block font-mono text-4xl font-bold">Aa</span>
            <span className="block text-xs text-gray-500">Secondary / Mono</span>
            <span className="text-xs font-semibold">JetBrains Mono</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-gray-900 dark:border-transparent dark:bg-white">
          <h3 className="mb-3 text-sm font-bold">Font Weights</h3>
          <div className="flex flex-col gap-2 text-sm">
            {fontWeights.map((item) => (
              <div className="flex justify-between" key={item.name}>
                <span className={item.classWeight}>{item.name}:</span>
                <span className="text-gray-500">{item.weight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Type Scale */}
      <h2 className="mb-2 text-xl font-bold">Type styles</h2>
      <p className="mb-8 text-sm text-gray-500 dark:text-[#8D90A0]">
        Each level of the Type Scale is defined to abstract context from each level.
      </p>

      <div className="flex flex-col gap-8">
        {typeStyles.map((type) => (
          <div
            className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-baseline dark:border-[#181826]"
            key={type.name}
          >
            <span className="w-24 text-xs font-bold tracking-wider text-gray-400 dark:text-[#8D90A0]">
              {type.name}
            </span>
            <p className={`${type.classSize} text-gray-900 dark:text-white`}>{type.sample}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
