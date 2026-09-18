

const fontWeights = [
  { name: "Regular", weight: "400", classWeight: "font-normal" },
  { name: "Medium", weight: "500", classWeight: "font-medium" },
  { name: "SemiBold", weight: "600", classWeight: "font-semibold" },
  { name: "Bold", weight: "700", classWeight: "font-bold" },
];

const typeStyles = [
  { name: "ALPHA", classSize: "text-4xl font-bold", sample: "The quick brown fox jumps over the lazy dog" },
  { name: "BETA", classSize: "text-3xl font-bold", sample: "The quick brown fox jumps over the lazy dog" },
  { name: "EPSILON", classSize: "text-2xl font-semibold", sample: "The quick brown fox jumps over the lazy dog" },
  { name: "DELTA", classSize: "text-xl font-semibold", sample: "The quick brown fox jumps over the lazy dog" },
  { name: "OMEGA", classSize: "text-base font-medium", sample: "The quick brown fox jumps over the lazy dog" },
  { name: "SIGMA", classSize: "text-xs font-bold uppercase tracking-wider", sample: "The quick brown fox jumps over the lazy dog" },
  { name: "PI", classSize: "text-sm font-normal", sample: "The quick brown fox jumps over the lazy dog" },
];

export const Typography = () => {
  return (
    <div className="min-h-screen p-8 bg-white dark:bg-[#0C0E16] text-gray-900 dark:text-[#E1E2ED] font-space-grotesk transition-colors duration-200">
      <h1 className="text-3xl font-bold mb-6">Typography</h1>
      <p className="text-gray-500 dark:text-[#8D90A0] mb-6 text-sm">
        Our Design System uses Space Grotesk as the primary font and JetBrains Mono for code blocks and secondary tokens.
      </p>

      {/* Tarjetas de Fuentes Locales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-2 p-6 rounded-xl bg-gray-50 dark:bg-white text-gray-900 border border-gray-200 dark:border-transparent flex justify-around items-center">
          <div className="text-center font-space-grotesk">
            <span className="text-4xl font-bold block mb-2">Aa</span>
            <span className="text-xs text-gray-500 block">Primary Font</span>
            <span className="text-xs font-semibold">Space Grotesk</span>
          </div>
          <div className="text-center font-jetbrains-mono">
            <span className="text-4xl font-bold block mb-2">Aa</span>
            <span className="text-xs text-gray-500 block">Secondary / Mono</span>
            <span className="text-xs font-semibold">JetBrains Mono</span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-gray-50 dark:bg-white text-gray-900 border border-gray-200 dark:border-transparent">
          <h3 className="font-bold mb-3 text-sm">Font Weights</h3>
          <div className="flex flex-col gap-2 text-sm">
            {fontWeights.map((item) => (
              <div key={item.name} className="flex justify-between">
                <span className={item.classWeight}>{item.name}:</span>
                <span className="text-gray-500">{item.weight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Type Scale */}
      <h2 className="text-xl font-bold mb-2">Type styles</h2>
      <p className="text-gray-500 dark:text-[#8D90A0] mb-8 text-sm">
        Each level of the Type Scale is defined to abstract context from each level.
      </p>

      <div className="flex flex-col gap-8">
        {typeStyles.map((type) => (
          <div
            key={type.name}
            className="flex flex-col sm:flex-row sm:items-baseline gap-4 border-b border-gray-100 dark:border-[#181826] pb-6"
          >
            <span className="w-24 text-xs font-bold text-gray-400 dark:text-[#8D90A0] tracking-wider">
              {type.name}
            </span>
            <p className={`${type.classSize} text-gray-900 dark:text-white`}>
              {type.sample}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};