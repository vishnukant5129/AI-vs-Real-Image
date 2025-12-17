Frontend deployment (Vercel)

This project has the frontend in `client/` and the backend in `server/`.

What I've already configured
- `vercel.json` at repo root points Vercel to `client/package.json` and `dist` as the output directory.
- `client/index.html` uses a local `/favicon.svg` to avoid 3rd-party CDN issues.
- `client/src/api.js` uses `VITE_API_BASE` so the same build can point to different backends.

Quick checklist before deploying
1. Install frontend deps and build locally to verify:

```bash
cd client
npm install
npm run build
```

2. Commit and push all changes to your GitHub repo:

```bash
git add -A
git commit -m "Prepare frontend for Vercel deployment"
git push origin main
```

Vercel (recommended: Git integration)
1. Go to https://vercel.com and connect your GitHub account.
2. Import this repository as a new Project.
3. Vercel will read `vercel.json` and use `client/package.json` to build.

If Vercel doesn't detect settings automatically, set manually:
- Root Directory: (leave blank)
- Build Command: `npm run build --prefix client`
- Output Directory: `client/dist`

Environment variables
- Add `VITE_API_BASE` with your production backend URL (no trailing slash), e.g. `https://api.example.com`.
- Add same var to `Preview` if you want preview deployments to hit a staging API.

CLI deploy (alternative)

```bash
npm i -g vercel
vercel login
# from project root
vercel --prod
# or deploy only the client folder
vercel --cwd client --prod
```

Notes
- The backend must be deployed separately (it is not part of this static Vercel site). For server hosting consider Render, Railway, or deploying server as Serverless functions (requires refactor).
- If you use three.js in components, install it locally:

```bash
cd client
npm install three
```

Then import in code instead of using CDN:

```js
import * as THREE from 'three';
```

Need me to:
- Commit and push these changes for you now, or
- Create the GitHub repo and push (if you don't want to use the existing remote), or
- Help deploy the backend and wire `VITE_API_BASE` automatically?

Tell me which of the above you want me to do next.
