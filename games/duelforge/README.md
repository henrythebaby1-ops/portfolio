# DuelForge (Local)

This project now supports real AI replies through an API.

## 1) Set your API key

In Terminal:

```bash
cd "/Users/jianjun_he/Documents/New project"
export OPENAI_API_KEY="your_api_key_here"
export OPENAI_MODEL="gpt-4o-mini"
python3 app.py
```

Then open:

`http://127.0.0.1:8000/start.html`
`http://127.0.0.1:8000/duelforge.html`

## Optional settings

- `OPENAI_MODEL`: defaults to `gpt-4o-mini`
- `OPENAI_BASE_URL`: defaults to `https://api.openai.com/v1`

You can set `OPENAI_BASE_URL` if you use an OpenAI-compatible provider.

## Build itch.io packages (macOS + Windows)

### Local macOS ZIP

```bash
cd "/Users/jianjun_he/Documents/New project/game"
./packaging/build_mac.sh
```

Output:

- `release/DuelForge-mac.zip`

### Local Windows ZIP (run on Windows)

```powershell
cd "C:\path\to\New project\game"
.\packaging\build_windows.ps1
```

Output:

- `release\DuelForge-windows.zip` (contains `DuelForge.exe` + required files)

### GitHub Actions (build both platforms)

Run workflow:

- `.github/workflows/build-itch.yml`

This produces downloadable artifacts:

- `DuelForge-mac` (zip)
- `DuelForge-windows` (zip)

## DuelForge Fortune Blade API

Create fighter:

```bash
curl -X POST http://127.0.0.1:8000/api/duelforge/fighters \
  -H "Content-Type: application/json" \
  -d '{"name":"Akira","element":"fire","weaponType":"katana","style":"balanced"}'
```

Spin wheel:

```bash
curl -X POST http://127.0.0.1:8000/api/duelforge/spin \
  -H "Content-Type: application/json" \
  -d '{"fighterId":"fighter_xxx"}'
```

Cooldown/status:

```bash
curl "http://127.0.0.1:8000/api/duelforge/spin-status?fighterId=fighter_xxx"
```

List fighters:

```bash
curl http://127.0.0.1:8000/api/duelforge/fighters
```
