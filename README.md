# NASA Backoffice

<img width="1512" height="826" alt="Screenshot 2026-09-15 at 16 55 40" src="https://github.com/user-attachments/assets/6585c51e-8584-4692-8431-b2ce6ba9f1f7" />


Backoffice hecho con [Payload 3](https://payloadcms.com) + Next.js para moderar los
comentarios del blog de noticias de la NASA. La única entidad de negocio es
`comments`; las noticias viven en el blog y acá se referencian por su id.

## Stack

- Next.js 16 (App Router) — una sola app: el CMS corre adentro
- Payload 3.88, montado en el route group `(payload)`
- Tailwind CSS v4 + shadcn/ui (estilo `new-york`, base `neutral`) para el front
- MongoDB (via `docker compose`)
- pnpm

## Estructura

```
src/
  app/
    (payload)/      <- Payload: admin en /admin, REST en /api, GraphQL
      admin/[[...segments]]/
      api/[...slug]/
      layout.tsx    <- root layout de Payload (@payloadcms/next/css)
    (frontend)/     <- la app Next
      globals.css   <- Tailwind + tokens de shadcn
      layout.tsx    <- root layout del front
      page.tsx
  components/ui/    <- componentes de shadcn
  lib/utils.ts      <- cn()
  collections/      <- Comments, Users + hooks
  access/           <- helpers de access control
  payload.config.ts
```

Cada route group tiene su **propio root layout**, así que los estilos no se
mezclan: Tailwind se importa sólo en `(frontend)/layout.tsx` y el admin sigue
usando el CSS de Payload. Verificado: en `/admin` no entra ninguna regla de
Tailwind, con lo cual el preflight no pisa los estilos del panel.

El grupo se llama `(payload)` porque Payload busca ahí el import map
(`app/(payload)/admin/importMap.js`). Si lo renombrás, hay que declarar la ruta
a mano en `admin.importMap.importMapFile` dentro de `src/payload.config.ts`.

## UI

shadcn ya está inicializado (`components.json`). Para sumar componentes:

```bash
npx shadcn@latest add dialog table dropdown-menu
```

Se generan en `src/components/ui/`. La utilidad `cn` viene del paquete oficial
`cn`; `@/lib/utils` la reexporta para que el alias siga funcionando.

## Puesta en marcha

```bash
cp .env.example .env   # ya hay un .env local generado
docker compose up -d   # levanta Mongo en localhost:27017
pnpm install
pnpm dev
```

Entrá a http://localhost:3000/admin y creá el primer usuario.

Variables de entorno:

| Variable         | Para qué                                                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`   | Conexión a Mongo                                                                                                           |
| `PAYLOAD_SECRET` | Firma los tokens de sesión (`openssl rand -hex 32`)                                                                        |
| `CORS_ORIGINS`   | Orígenes del blog habilitados para pegarle a la API, separados por coma                                                    |
| `CSRF_ORIGINS`   | Orígenes que pueden usar la cookie de sesión (incluí el del admin)                                                         |
| `CSRF_ORIGINS`   | Orígenes que pueden usar la cookie de sesión (admin + blog). Si falta el admin, drawers/respuestas fallan con Unauthorized |

## Colecciones

### `comments`

| Campo                        | Tipo         | Notas                                                        |
| ---------------------------- | ------------ | ------------------------------------------------------------ |
| `articleId`                  | text         | Id de la noticia de la NASA. Requerido e indexado.           |
| `articleUrl`                 | text         | Opcional, para abrir la noticia desde el admin.              |
| `authorName` / `authorEmail` | text / email | El email sólo se lee estando autenticado.                    |
| `content`                    | textarea     | Máx. 5000 caracteres.                                        |
| `parent`                     | relationship | Apunta a otro `comment`. Vacío = comentario de primer nivel. |
| `replies`                    | join         | Respuestas directas, derivadas de `parent`.                  |
| `status`                     | select       | `pending` (default), `approved`, `rejected`, `spam`.         |

### `users`

Usuarios del backoffice. Auth de Payload, sin roles.

## Respuestas anidadas

`parent` + el join `replies` arman el árbol. Reglas que aplica la colección:

- un comentario no puede ser su propio padre;
- una respuesta hereda el `articleId` del padre, así un hilo nunca queda partido entre noticias;
- no se pueden armar ciclos (se recorre la cadena de ancestros antes de guardar);
- al borrar un comentario se borran sus respuestas en cascada.

Para traer un hilo completo desde el blog conviene pedir todos los comentarios del
artículo y armar el árbol en memoria:

```
GET /api/comments?where[articleId][equals]=<id>&limit=200&depth=0&sort=createdAt
```

Cada doc trae `parent`, así que el anidado se reconstruye de una sola query.

## Acceso

| Operación | Anónimo (el blog)                 | Autenticado |
| --------- | --------------------------------- | ----------- |
| create    | sí, siempre entra como `pending`  | sí          |
| read      | sólo los `approved`, sin el email | todo        |
| update    | no                                | sí          |
| delete    | no                                | sí          |

El campo `status` sólo se puede escribir estando autenticado: si el blog manda
`status: "approved"` en el POST, se ignora y el comentario queda pendiente.

## Scripts

| Comando                   | Qué hace                         |
| ------------------------- | -------------------------------- |
| `pnpm dev`                | Servidor de desarrollo           |
| `pnpm build`              | Build de producción              |
| `pnpm generate:types`     | Regenera `src/payload-types.ts`  |
| `pnpm generate:importmap` | Regenera el import map del admin |
| `pnpm lint`               | ESLint                           |
