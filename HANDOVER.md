# CEO Mentor — Claude Code Handover

## What this is
A React/Vite single-page app: an AI-powered CEO mentor chat interface. It calls the Anthropic API directly from the browser using the claude-sonnet-4-20250514 model. The mentor persona is a composite of Andy Grove, Matt Mochary, Jim Collins, Steve Jobs, Elon Musk, and Kevin O'Leary.

## Project structure
```
ceo-mentor/
├── index.html
├── vite.config.js
├── package.json
├── staticwebapp.config.json        ← Azure routing config
├── .gitignore
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml   ← Auto-deploys to Azure on push to main
└── src/
    ├── main.jsx
    └── App.jsx                     ← Entire app (single file)
```

## Your tasks

### 1. Install dependencies
```bash
npm install
```

### 2. Test locally
```bash
npm run dev
```
Open http://localhost:5173 — the app should load. Note: API calls require the Anthropic API key to be handled by the proxy (already configured in claude.ai context).

### 3. Create GitHub repo and push
```bash
git init
git add .
git commit -m "Initial commit: CEO Mentor app"
gh repo create ceo-mentor --public --push --source=.
```
(Requires GitHub CLI: `winget install GitHub.cli` then `gh auth login`)

### 4. Connect to Azure Static Web Apps
1. Go to Azure Portal → Create resource → Static Web App
2. Name: `ceo-mentor`
3. Plan: Free
4. Region: East US (or closest to your users)
5. Source: GitHub → select the `ceo-mentor` repo → branch: `main`
6. Build preset: **Vite**
7. App location: `/`
8. Output location: `dist`
9. Click Review + Create

Azure will automatically add the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret to your GitHub repo and trigger the first deployment via GitHub Actions.

### 5. After deployment
The app will be live at: `https://<random-name>.azurestaticapps.net`

Every push to `main` auto-deploys. No manual steps needed after initial setup.

## Notes
- The Anthropic API key is injected at runtime by the claude.ai proxy — no .env file needed for the hosted version
- The app is fully static — no backend, no server, no database
- Single file app: all logic, styles, SVG portraits and API calls are in `src/App.jsx`
