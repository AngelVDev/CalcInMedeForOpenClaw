# CalcInMedeForOpenClaw

Baseline implementation for a **meme calculator**:
- Supports core calculator operations (`+`, `-`, `*`, `/`, decimal, backspace, clear)
- Triggers meme text when pressing numbers
- Plays lightweight retro beep sound effects on interactions

## Run locally

Because this is static HTML/CSS/JS, you can run it with any static server.

Example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Project files

- `index.html` — UI structure
- `styles.css` — styling/layout
- `script.js` — calculator logic + meme/sound behavior
