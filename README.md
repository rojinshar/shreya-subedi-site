# Shreya Subedi — creator site

A one-page site built with React and Vite, deployed to Cloudflare Pages from GitHub.

## Editing content

All text, links, stats and images are in [`src/content.js`](src/content.js).

- **Photos:** every image path (hero, About collage, Work rows) is in
  `content.js` and the files live in `public/`. The current ones are all crops
  of one photo; swap in new photos any time.
- **Italics:** in headings and the intro, words wrapped in `*asterisks*` are
  set in italics.
- **Work rows:** add another item to `work.items` and it gets the next numeral
  (III., IV., …) and alternates sides automatically.
- **Email:** set `contact.email` to show it under the contact button.
- **Link previews:** the title, description and `og:image` are in `index.html`.
  The preview image is `public/og-image.jpg` (1200×630). Once the site has its
  final domain, make the `og:image` URL absolute.

## Running locally

Requires Node 22 (`nvm use` reads `.nvmrc`).

```sh
npm install
npm run dev      # http://localhost:5173
```

## Deploying (GitHub → Cloudflare Pages)

1. Create an empty repository on GitHub, then push this project:

   ```sh
   git add -A
   git commit -m "Initial site"
   git remote add origin https://github.com/<you>/shreya-subedi-site.git
   git push -u origin main
   ```

2. In the Cloudflare dashboard go to **Workers & Pages → Create → Pages →
   Connect to Git**, authorize GitHub and pick the repository.

3. Use these build settings:

   | Setting          | Value           |
   | ---------------- | --------------- |
   | Framework preset | React (Vite)    |
   | Build command    | `npm run build` |
   | Output directory | `dist`          |

   Cloudflare reads `.nvmrc`, so it builds with Node 22 automatically.

4. Click **Save and Deploy**. The site goes live at
   `https://<project-name>.pages.dev`.

After that, every push to `main` redeploys the site, and every other branch
gets its own preview URL.

### Custom domain

In the Pages project, open **Custom domains → Set up a domain**. If the domain
is already on Cloudflare, DNS is configured automatically.
