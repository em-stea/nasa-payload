import {z} from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_ENVIRONMENT: z.string().min(1),
  NEXT_PUBLIC_NASA_API_KEY: z.string().min(1),
});

const parsedEnv = envSchema.safeParse({
  NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
  NEXT_PUBLIC_NASA_API_KEY: process.env.NEXT_PUBLIC_NASA_API_KEY,
});

if (!parsedEnv.success) {
  const black = "\x1b[30m";
  const bgYellow = "\x1b[43m";
  const underline = "\x1b[4m";
  const bold = "\x1b[1m";
  const reset = "\x1b[0m";
  const bgRed = "\x1b[41m";
  const errors = parsedEnv.error.format();

  console.error(
    `
   ${bgRed}${underline} ${bold} INVALID ENVIRONMENT VARIABLES ${reset}\n ${underline}Details:${reset}
  `,
  );

  Object.keys(errors).forEach((key) => {
    if (key === "_errors" && errors[key].length < 1) return;

    console.error(
      `${bgYellow}${black}${bold}${key}${reset}:`,
      errors[key as keyof typeof errors],
      "\n",
    );
  });
  throw new Error("Invalid environment variables. Check the console for details.");
}

export const FRONT_ENV = parsedEnv.data;
