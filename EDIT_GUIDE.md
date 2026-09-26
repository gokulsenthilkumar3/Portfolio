# Editing and publishing the portfolio

`src/config/portfolio.config.ts` is the checked-in, curated fallback. It supplies the initial public page, case studies, and metadata when no published record exists. Keep personal and project facts there so a fresh deployment still has useful content. Do not put essential copy inside project images.

For edits without a code deployment, sign in at `/admin`. The editor saves a private draft; visitors continue to see the last published version. Review the draft, then use **Publish changes** to validate and save a separate public record. A failed publish reports an error and does not claim that visitors have received the draft. The public record is allowlisted so private draft-only fields are not sent to visitors.

Locally, drafts and published content use `.portfolio-admin-data.json` and `.portfolio-published-data.json`. Both files are ignored by Git. In production, publishing requires a persistent Upstash/Vercel KV store. Configure `KV_REST_API_URL` and `KV_REST_API_TOKEN` in the deployment environment. Without them, the site serves the checked-in fallback and Publish returns an error. Never commit these credentials.

Admin login requires `JWT_SECRET` and a bcrypt hash in `ADMIN_PIN_HASH`; a plain `ADMIN_PIN` is not used. Set these in the deployment environment, not in source control. To generate a hash locally, run `node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 12))" YOUR_NEW_PIN` and copy only the resulting hash to the environment variable. Choose a private PIN and secret.

After publishing, check the home page, `/projects/<slug>` pages, `/api/portfolio`, and page metadata in a private browser session. The gallery includes projects whose `kind` is not `research`; research archives remain separately linked. Project counts are derived from this curated list, while public repository count comes from GitHub with a labeled fallback.

Before pushing local changes, run `npm run type-check`, `npm run lint`, `npm run build`, and `npm run test:e2e -- --workers=1`. The EverGreen Yarn-Management work is a separate Git repository and must be reviewed, committed, and pushed from that checkout independently.
