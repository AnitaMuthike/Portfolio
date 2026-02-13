# Anita Portfolio (SSR with Node, Express, MongoDB)

## Stack
- Node.js + Express
- EJS server-side rendering
- MongoDB with Mongoose

## Project Structure
```text
src/
  app.js
  server.js
  config/
  controllers/
  db/
  middlewares/
  models/
  services/
  utils/
  views/
public/
  images/
```

## Setup
1. Use Node.js `>=20.19.0`.
2. Install dependencies:
```bash
npm install
```
3. Create env file:
```bash
cp .env.local.example .env.local
```
4. Set a strong `APP_SECRET` in `.env.local`.
5. Ensure MongoDB is running on your machine (or set your own `MONGODB_URI`).
6. Start the app:
```bash
npm start
```
7. Open:
```text
http://localhost:3000
```

## Deploy on Vercel
1. Push this project to GitHub.
2. In Vercel, create a new project and import the repository.
3. Keep defaults:
```text
Framework Preset: Other
Build Command: npm install
Output Directory: (empty)
Install Command: npm install
```
4. Add environment variables in Vercel Project Settings:
```text
APP_SECRET
MONGODB_URI
CV_FILE (optional, defaults to Anita_Muthike_Professional_CV_Improved_Layout.pdf)
CONTACT_RATE_LIMIT_WINDOW_MS
CONTACT_RATE_LIMIT_MAX
CONTACT_EMAIL_ENABLED
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASS
CONTACT_EMAIL_FROM_NAME
CONTACT_EMAIL_FROM
CONTACT_EMAIL_TO
```
5. Redeploy after saving env vars.

Notes:
- Vercel entrypoint is `api/index.js`.
- Routing is configured in `vercel.json`.
- MongoDB should be on Atlas (or any internet-accessible cluster); local MongoDB will not be reachable from Vercel.

## Features Implemented
- Portfolio page is server-rendered from `src/views/index.ejs`.
- Contact form submits to `POST /contact` and saves messages in MongoDB.
- Contact payload validation uses Joi schema rules in `src/utils/validators.js`.
- Optional email notifications can send each new contact message to your inbox.
- Notification emails use a styled HTML template in `src/utils/emailTemplates.js`.
- Contact form is protected with CSRF token validation.
- Contact submissions are rate-limited and include a honeypot bot trap.
- CV download is served from `GET /download-cv` as a PDF attachment.
- Static assets are served from `public/`.

## CV File
- Current server CV target:
`Anita_Muthike_Professional_CV_Improved_Layout.pdf`

You can change this in `.env.local` using:
`CV_FILE=your-file-name.pdf`

## Security Config
- `APP_SECRET`: used to sign CSRF and flash cookies.
- `CONTACT_RATE_LIMIT_WINDOW_MS`: contact rate limit window length.
- `CONTACT_RATE_LIMIT_MAX`: max contact requests allowed per window and IP.
- Startup is fail-fast: missing core env vars (or placeholder `APP_SECRET`) stop the app.

## Email Notification Config
- `CONTACT_EMAIL_ENABLED`: set to `true` to enable inbox notifications.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`: SMTP transport credentials.
- `CONTACT_EMAIL_FROM_NAME`: display name shown as sender in inbox (e.g. `Anita Portfolio`).
- `CONTACT_EMAIL_FROM`: sender address for notification emails.
- `CONTACT_EMAIL_TO`: recipient address where contact emails are sent.
- When email notifications are enabled, missing mail config values fail at startup.

To regenerate the PDF from your DOCX:
```bash
npm run cv:pdf
```
