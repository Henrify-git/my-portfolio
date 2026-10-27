# My Portfolio: how to maintain it

No frameworks, no `npm install`, no coding knowledge needed. You edit **one content file**, **one color file**, and drop images in a folder.

> **Why not Next.js / TypeScript?** The design was already plain HTML/CSS/JS. Keeping it that way means nothing can break from a failed install, any host can serve it, and your content file is simple to edit. The layout is untouched.

## Where things live
| I want to change… | Edit this file |
|---|---|
| Name, bio, roles, stats, projects, designs, links, email, resume | `src/data/portfolio.js` |
| Any color | `src/styles/theme.css` |
| Photos and screenshots | drop files in `public/images/` |
| Layout / animation (rarely) | `src/styles/main.css`, `src/main.js` |

## Run it on your computer
1. Install **Node.js** (nodejs.org, the LTS version). You only need this once.
2. Open a terminal in this folder and run `node serve.js` (or `npm run dev`).
3. Open **http://localhost:3000**. Edit a file, save, refresh the browser.

(Quick look without Node: double-click `index.html`. Everything works except nothing needs a server here.)

## Edit your content: safe rules
Open `src/data/portfolio.js`. Only change text **between the "quote marks"**. Never delete a comma, bracket `[ ]` or brace `{ }`. If the page goes blank, undo your last edit; the mistake is almost always a missing comma or quote. Run `node build.js` to get a plain-English check of your file.

**Examples**
- Change name: `name: "Your Name"` -> `name: "Daniel Okafor"`
- Change email: `email: "you@example.com"` -> `email: "daniel@mail.com"`
- Rename the 4th hero word: edit the last item in `corners: [...]`
- Change a statistic: `["00+", "Label one"]` -> `["50+", "Projects delivered"]`
- Add a tool to the strip: add `, "Figma"` before the `]` in `tools`.

## Add a design (with its own story page)
In `designs: [ ... ]`, copy one whole block from `{` to `},` and paste it after the last block (make sure there's a comma between blocks). Change:
1. `slug`: unique, lowercase, dashes only (e.g. `"fintech-app"`). It becomes the page address.
2. `name`, `kind`, `summary`: shown in the list.
3. `image`: cover image path. `liveUrl`: where the **View live website/app** button goes (`liveLabel` is the button text).
4. `story`: the chapters on the design's page. Add/remove `{ title, text, image }` lines freely.

Click a design on the home page -> `design.html?d=<slug>`. A wrong slug shows a friendly "Design not found".

## Replace images
Save the file in `public/images/` with **the exact name below** (or change the path in `portfolio.js`). Missing files just show a blue placeholder.

| File | Where it appears | Good size |
|---|---|---|
| `public/images/profile.jpg` | Front of the ID badge | 800×900 portrait |
| `public/images/intro-portrait.jpg` | Big photo beside intro text | 1000×1200 |
| `public/images/intro-screenshot.jpg` | Small tablet over that photo | 600×800 |
| `public/images/about.jpg` | About section | 1400×1100 landscape |
| `public/images/projects/project-1.jpg` … `project-6.jpg` | Selected work cards (3, 4 and 6 are phone-shaped) | 1200×850 (phone: 600×850) |
| `public/images/designs/<slug>-cover.jpg` | Design list thumbnail + top of its page | 1600×900 |
| `public/images/designs/<slug>-1.jpg`, `-2.jpg` … | Story chapter images | 1200×900 |
| `public/resume.pdf` | Resume link | n/a |

Tips: use `.jpg` or `.webp`, keep each under ~500 KB, and don't use spaces in file names.

## Change colors
Open `src/styles/theme.css`. Every color has a name and a comment:
- Deep hero/dark sections: `--hero-dark`, `--hero-light`
- Light steel-blue sections: `--surface`, `--surface-2`, `--surface-light`
- Accents and hover: `--accent`, `--accent-bright`, `--highlight`
- Buttons and headings: `--ink`; nav pill: `--nav-bg`
- ID badge: the `--strap-*`, `--holder-*`, `--paper-*` group

Example: swap blue accent for green -> `--accent:#2f7bff;` becomes `--accent:#16a34a;`. Change one color at a time and refresh. (A few neutral whites and black shadows remain in `main.css`.)

## Production build
`node build.js` (or `npm run build`) checks your content (duplicate slugs, missing fields, missing images) and writes the finished site to **`dist/`**. If it prints `BUILD FAILED`, it tells you what to fix. `npm run preview` builds and serves `dist/` locally.

## Deploy (free)
Always run the build first, then upload the **`dist`** folder:
- **Netlify:** drag-and-drop `dist` onto app.netlify.com/drop.
- **Vercel:** import the repo, Build Command `node build.js`, Output Directory `dist`.
- **GitHub Pages / Cloudflare Pages:** same: build command `node build.js`, publish directory `dist`.

## Troubleshooting
- **Blank page:** a comma or quote broke `portfolio.js`; undo and retry.
- **Image not showing:** check the exact file name and capital letters.
- **Name looks cut off on the badge:** the badge shows your first name only; very long names shorten with "...".
