import {headingVariants} from "@/shared/styles/components/heading";
import {textVariants} from "@/shared/styles/components/text";

const fontWeights = [
  {name: "Regular", weight: "400", classWeight: "font-normal"},
  {name: "Medium", weight: "500", classWeight: "font-medium"},
  {name: "SemiBold", weight: "600", classWeight: "font-semibold"},
  {name: "Bold", weight: "700", classWeight: "font-bold"},
];

const headingScale = [
  {name: "title.1", size: "64px / 4rem", variant: "title.1"},
  {name: "title.1-bold", size: "48px / 3rem", variant: "title.1-bold"},
  {name: "title.2", size: "32px / 2rem", variant: "title.2"},
  {name: "title.3", size: "20px / 1.25rem", variant: "title.3"},
  {name: "title.4", size: "14px / 0.875rem", variant: "title.4"},
  {name: "title.5", size: "16px / 1rem", variant: "title.5"},
] as const;

const textScale = [
  {name: "body.1", size: "16px / 1rem", variant: "body.1"},
  {name: "body.2", size: "16px / 1rem", variant: "body.2"},
  {name: "body.3", size: "14px / 0.875rem", variant: "body.3"},
  {name: "body.4", size: "12px / 0.75rem", variant: "body.4"},
  {name: "button.1", size: "14px / 0.875rem", variant: "button.1"},
  {name: "button.2", size: "16px / 1rem", variant: "button.2"},
  {name: "eyebrow", size: "12px / 0.75rem", variant: "eyebrow"},
  {name: "meta.1", size: "12px / 0.75rem", variant: "meta.1"},
  {name: "meta.2", size: "12px / 0.75rem", variant: "meta.2"},
  {name: "meta.3", size: "12px / 0.75rem", variant: "meta.3"},
  {name: "nav.link", size: "14px / 0.875rem", variant: "nav.link"},
  {name: "drawer.item", size: "14px / 0.875rem", variant: "drawer.item"},
  {name: "card.title", size: "20px / 1.25rem", variant: "card.title"},
  {name: "card.title.sm", size: "18px / 1.125rem", variant: "card.title.sm"},
  {name: "card.stat", size: "16px / 1rem", variant: "card.stat"},
  {name: "card.stat.label", size: "12px / 0.75rem", variant: "card.stat.label"},
] as const;

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog";

export const Typography = () => {
  return (
    <div className="min-h-screen bg-white p-8 font-space-grotesk text-gray-900 transition-colors duration-200 dark:bg-[#0C0E16] dark:text-[#E1E2ED]">
      <h1 className="mb-2 font-space-grotesk text-3xl font-bold">Typography</h1>
      <p className="mb-6 font-jetbrains-mono text-sm text-gray-500 dark:text-[#8D90A0]">
        Our Design System uses Space Grotesk as the primary font for headings and structural tokens,
        and JetBrains Mono for telemetry, controls, and body text.
      </p>

      {/* Tarjetas de Fuentes Locales */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-center justify-around rounded-xl border border-gray-200 bg-gray-50 p-6 text-gray-900 md:col-span-2 dark:border-transparent dark:bg-white">
          <div className="text-center font-space-grotesk">
            <span className="mb-2 block text-4xl font-bold">Aa</span>
            <span className="block text-xs text-gray-500">Primary Font</span>
            <span className="text-xs font-semibold">Space Grotesk</span>
          </div>
          <div className="text-center font-jetbrains-mono">
            <span className="mb-2 block text-4xl font-bold">Aa</span>
            <span className="block font-jetbrains-mono text-xs text-gray-500">
              Secondary / Mono
            </span>
            <span className="font-jetbrains-mono text-xs font-semibold">JetBrains Mono</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-gray-900 dark:border-transparent dark:bg-white">
          <h3 className="mb-3 font-space-grotesk text-sm font-bold">Font Weights</h3>
          <div className="flex flex-col gap-2 font-jetbrains-mono text-sm">
            {fontWeights.map((item) => (
              <div className="flex justify-between" key={item.name}>
                <span className={item.classWeight}>{item.name}:</span>
                <span className="text-gray-500">{item.weight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Headings Scale */}
      <section className="mb-20 rounded-xl border border-red-500 p-6 dark:border-[#181826]">
        <h2 className="mb-2 font-space-grotesk text-xl font-bold">
          Heading Variants (Space Grotesk)
        </h2>
        <p className="mb-8 font-jetbrains-mono text-sm text-gray-500 dark:text-[#8D90A0]">
          Variants from <code>headingVariants</code> using <code>font-space-grotesk</code>.
        </p>

        <div className="flex flex-col gap-8">
          {headingScale.map((item) => (
            <div
              className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-baseline dark:border-[#181826]"
              key={item.name}
            >
              <div className="flex w-52 shrink-0 flex-col font-jetbrains-mono">
                <span className="text-sm font-bold tracking-wider text-gray-900 dark:text-white">
                  {item.name}
                </span>
                <span className="text-sm text-gray-400 dark:text-[#8D90A0]">{item.size}</span>
              </div>
              <h3
                className={`${headingVariants({variant: item.variant})} text-gray-900 dark:text-white`}
              >
                {SAMPLE_TEXT}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Text Scale */}
      <section className="rounded-xl border border-gray-100 p-6 dark:border-[#181826]">
        <h2 className="mb-2 font-space-grotesk text-xl font-bold">
          Text & Telemetry Variants (JetBrains Mono)
        </h2>
        <p className="mb-8 font-jetbrains-mono text-sm text-gray-500 dark:text-[#8D90A0]">
          Variants from <code>textVariants</code> using <code>font-jetbrains-mono</code>.
        </p>

        <div className="flex flex-col gap-6">
          {textScale.map((item) => (
            <div
              className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-baseline dark:border-[#181826]"
              key={item.name}
            >
              <div className="flex w-52 shrink-0 flex-col font-jetbrains-mono">
                <span className="text-sm font-bold tracking-wider text-gray-900 dark:text-white">
                  {item.name}
                </span>
                <span className="text-sm text-gray-400 dark:text-[#8D90A0]">{item.size}</span>
              </div>
              <p
                className={`${textVariants({variant: item.variant})} text-gray-900 dark:text-white`}
              >
                {SAMPLE_TEXT}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
