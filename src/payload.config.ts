import path from "path";
import {fileURLToPath} from "url";

import {mongooseAdapter} from "@payloadcms/db-mongodb";
import {lexicalEditor} from "@payloadcms/richtext-lexical";
import {buildConfig} from "payload";

import {Comments} from "./collections/Comments";
import {Favorites} from "./collections/Favorites";
import {Notifications} from "./collections/Notifications";
import {SiteUsers} from "./collections/SiteUsers";
import {Users} from "./collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const parseOrigins = (value?: string) =>
  value
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

// CORS: orígenes del blog que llaman a la API.
// CSRF: orígenes que pueden usar la cookie de sesión (admin + blog).
// Las server actions del admin envían Origin; si no está en csrf, Payload
// descarta el token y canAccessAdmin lanza Unauthorized.
const corsOrigins = parseOrigins(process.env.CORS_ORIGINS);
const csrfOrigins = parseOrigins(process.env.CSRF_ORIGINS);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: "- NASA Backoffice",
    },
  },
  collections: [Comments, SiteUsers, Favorites, Notifications, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || "",
  }),
  cors: corsOrigins,
  csrf: csrfOrigins.length > 0 ? csrfOrigins : corsOrigins,
  plugins: [],
});
