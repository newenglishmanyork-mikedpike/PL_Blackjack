# Premier League Blackjack

A fantasy pool where each entry picks 4 Premier League players and tries to
total exactly 21 combined league goals across the season — go over 21 and
you bust, and every player must score at least once for the entry to
qualify. `index.html` renders the live leaderboard; goal counts update
automatically, no manual score entry.

## How it works

- `index.html` — the page. It reads `data/entries.json` (who picked whom)
  and `data/scores.json` (current goal counts) and renders the board.
- `data/entries.json` — one array entry per contestant's 4 picks. Edited by
  hand and committed — squads are locked in once, like a normal FPL-style
  draft, so this doesn't need a login or a database.
- `data/scores.json` — generated automatically. Don't edit it by hand.
- `.github/workflows/refresh-scores.yml` — a GitHub Actions workflow that
  runs every 6 hours (and can be run manually), calls the free
  [football-data.org](https://www.football-data.org/) API for current
  Premier League top scorers, and commits the result to
  `data/scores.json`. Because this runs on GitHub's servers rather than in
  everyone's browser, no API key ever gets sent to visitors' browsers.

## One-time setup

1. **Get a free API key**
   Register at <https://www.football-data.org/client/register> (free tier:
   10 requests/minute, includes the Premier League). You'll get a token by
   email.

2. **Add it as a repository secret**
   In this repo: Settings → Secrets and variables → Actions → New
   repository secret. Name it `FOOTBALL_DATA_TOKEN`, paste the token.

3. **Enable GitHub Pages**
   Settings → Pages → under "Build and deployment", set Source to
   "Deploy from a branch", pick the branch this project lives on (e.g.
   `main`) and folder `/ (root)`, then Save. GitHub will give you a URL
   like `https://<your-username>.github.io/<repo-name>/` — that's the link
   to share with your friends.

4. **Run the workflow once manually** so `data/scores.json` gets filled in
   immediately instead of waiting for the first scheduled run: Actions tab
   → "Refresh scores" → Run workflow.

5. **(Optional) Set up the on-page "Refresh live scores" button**
   Besides the automatic 6-hourly refresh, the page has a button that
   triggers the same workflow on demand. This requires a GitHub token
   pasted directly into `index.html` — **read the security note below
   before setting this up**, since that token is visible to anyone who
   views the page's source.

   1. GitHub → your avatar → Settings → Developer settings → Personal
      access tokens → **Fine-grained tokens** → Generate new token.
   2. Resource owner: the account/org that owns this repo.
   3. Repository access: "Only select repositories" → pick this repo only.
   4. Permissions → Repository permissions → **Actions** → "Read and
      write". Leave everything else "No access".
   5. Set an expiration, generate, and copy the token (starts with
      `github_pat_`).
   6. Open `index.html`, find `GH_TOKEN` near the top of the `<script>`
      block, and paste the token in place of
      `'PASTE_YOUR_FINE_GRAINED_TOKEN_HERE'`. Commit and push to `main`.

   **Security note:** this token is embedded in client-side JavaScript,
   so it is effectively public — anyone who opens dev tools or views the
   page source can read and reuse it. It's scoped as narrowly as GitHub
   allows (this one repo, Actions read/write only), so it can trigger or
   read workflow runs but cannot read or change any file, read repository
   secrets, or touch any other repo. Worst case if someone grabs it: they
   can spam-trigger the refresh workflow, burning your football-data.org
   rate limit and GitHub Actions minutes. If that ever happens, revoke the
   token from Settings → Developer settings → Personal access tokens and
   generate a fresh one. If you'd rather avoid this exposure entirely,
   just use the automatic schedule and/or the "Run workflow" button on
   GitHub's own Actions tab instead — leave `GH_TOKEN` as the placeholder
   and the on-page button will just show a message pointing here instead
   of doing anything.

## Adding entries

Open the page and click **Add an entry** — fill in the entry name, owner,
and 4 players, then click **Generate JSON**. Copy the result into
`data/entries.json` as a new item in the array, then commit and push (or
open a pull request). You can also just edit the file directly:

```json
{
  "name": "Dave's XI",
  "owner": "Dave",
  "players": [
    { "name": "Erling Haaland", "team": "Manchester City" },
    { "name": "Mohamed Salah", "team": "Liverpool" },
    { "name": "Bukayo Saka", "team": "Arsenal" },
    { "name": "Cole Palmer", "team": "Chelsea" }
  ]
}
```

**Player names should be close to how football-data.org spells them**
(usually their full registered name, e.g. "Erling Haaland") for goals to
match up. Matching ignores case, accents, and punctuation (so "Ødegaard"
and "Odegaard", or "Dewsbury-Hall" and "Dewsbury Hall", all match fine),
but it still needs the same words in the same order. If a player shows 0
when you know they've scored, check the spelling against
`data/scores.json` after a refresh — that file lists every name the API
currently recognizes as having scored.

## Local preview

Because the page fetches local JSON files, opening `index.html` directly
(`file://`) will fail — browsers block that. Serve it locally instead:

```
npx serve .
# or
python3 -m http.server 8000
```

then open the printed `localhost` URL.

## Limitations

- The free football-data.org tier's scorers list only includes players who
  have scored at least once this season, capped at 100 entries — that's
  fine here, since anyone not on that list simply has 0 goals.
- Team names on player cards are just labels you type in — they aren't
  validated against anything.
- Editing entries requires git access (or asking whoever maintains the
  repo to add a pull request). There's no in-browser save.
