# MyDiary

An online journal: sign up, write diary entries, view, edit and search them.

| Part | Stack | Folder |
| --- | --- | --- |
| API | Node 24, Express 5, PostgreSQL (`pg`), JWT auth | [`server/`](server/) |
| Web app | React 19, React Router, Redux Toolkit store, Vite | [`client/`](client/) |
| Database | PostgreSQL 17 | Docker volume, schema in [`server/src/models/migrate.js`](server/src/models/migrate.js) |

## Run everything with Docker

Needs Docker with Compose v2.

```bash
cp .env.example .env              # optional: every value has a working default
docker compose up --build
```

- Web app: http://localhost:8080
- API: http://localhost:3000 (health check: http://localhost:3000/health)
- Postgres: `localhost:5433`, user/password/db `mydiary`

The server creates its tables on start-up. nginx in the `client` container serves the built app and proxies `/api/*` to the server.

Stop with `docker compose down`. Add `-v` to also delete the database volume.

## Tests

```bash
docker compose run --rm server-test   # API tests against the mydiary_test database
docker compose run --rm client-test   # React/Redux tests (no database needed)
```

Without Docker for the app itself:

```bash
docker compose up -d db               # or point TEST_DATABASE_URL at any Postgres

cd server && cp .env.example .env && npm install
npm test                              # resets and uses TEST_DATABASE_URL
npm run lint

cd ../client && npm install
npm test
npm run lint
npm run build
```

> The `mydiary_test` database is created by [`db/init/01-create-test-db.sql`](db/init/01-create-test-db.sql) the first time the Postgres volume is created. If you had a volume from before that file existed, run `docker compose down -v` once.

## Local development (hot reload)

```bash
docker compose up -d db
cd server && npm run dev              # http://localhost:3000, restarts on change
cd client && npm run dev              # http://localhost:8080, proxies /api to :3000
```

## API

All routes are under `/api/v1`. Authenticated routes take the token from `signin`/`signup` in an `x-access-token` header (an `Authorization: Bearer <token>` header or a `?token=` query parameter also work).

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/signup` | – | Create an account `{ fullname, username, email, password }` |
| POST | `/auth/signin` | – | Log in `{ username, password }` |
| GET | `/user/details` | ✓ | Current user's profile |
| PUT | `/user/details` | ✓ | Update any of `fullname, username, email, reminder, password` |
| PUT | `/user/upload` | ✓ | Upload a profile picture (multipart field `image`; needs Cloudinary env vars) |
| GET | `/entries` | ✓ | List the user's entries, newest first |
| POST | `/entries` | ✓ | Add an entry `{ title, entry, date? }` |
| GET | `/entries/search?entry=text` | ✓ | Search the user's entries by title or body |
| GET | `/entries/:id` | ✓ | One entry |
| PUT | `/entries/:id` | ✓ | Update an entry `{ title, entry, date }` |
| DELETE | `/entries/:id` | ✓ | Delete an entry |

## Configuration

See [`.env.example`](.env.example) (Docker Compose) and [`server/.env.example`](server/.env.example) (running the server directly). For managed Postgres that requires SSL (AWS RDS, Neon, Render), set `DB_SSL=true`.

Optional integrations are off unless configured:
- **Cloudinary** (`CLOUDINARY_*`): profile picture uploads. Without it, `/user/upload` returns 503.
- **Mail** (`MAIL_USER`, `MAIL_PASSWORD`): reminder e-mails every *N* days, where *N* is the user's `reminder` setting.

## Known gaps

These are not built yet:

- **Profile page**: shows the user's details, but **Save changes** and the picture picker are not wired up to the API (`PUT /user/details`, `PUT /user/upload`).
- **Deleting entries** is supported by the API, but the web app has no delete button.
- **Search** is supported by the API, but the web app has no search box.
- **Reminder schedules** are kept in server memory, so they are lost when the server restarts, and only one server instance can run them.
- There is no pagination on `GET /entries`.
