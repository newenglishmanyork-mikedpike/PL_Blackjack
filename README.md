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

5. **The "Refresh live scores" button** needs no setup — it just opens
   GitHub's own "Run workflow" page for you in a new tab, where you (or
   anyone signed into GitHub with access to this repo) click "Run
   workflow" to kick off an immediate refresh, then come back and hit
   "Reload data" a minute later.

   We initially tried making this button trigger the refresh directly,
   with no extra clicks needed. That requires a GitHub token embedded in
   the page, which is a real security exposure (anyone can read it from
   the page source) — and on top of that, GitHub's fine-grained tokens
   hit an undocumented `403 Resource not accessible by integration` wall
   on this specific API call no matter how they were scoped, even
   following GitHub's own documented fix. Given a real security tradeoff
   for a feature that didn't reliably work anyway, we dropped it for this
   safer deep-link version instead. No credential lives in this page.

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

## Projected total

The leaderboard's "Proj." column estimates each entry's end-of-season
total: for each of the 4 players, (goals so far ÷ their appearances so
far) × their team's remaining Premier League fixtures, added to the
entry's current actual goals. The emoji is just a quick read on that
number relative to 21 (😴 way under, 😬 needs work, 😊 good pace, 🎯 right
on target, 😅 getting risky, 🤯 way past).

This is **not xG (expected goals)** — the free football-data.org tier
doesn't expose that at all (nor do most free football APIs, reliably).
It's a simpler proxy using each player's own actual scoring rate, which
is why it's noisy early in the season (small sample sizes) and treats a
tap-in the same as a wonder strike. Players with 0 goals so far don't
appear in the scorers feed at all, so they have no appearances/team data
to project from — their projected contribution is just 0, same as their
current tally.

## Limitations

- The free football-data.org tier's scorers list only includes players who
  have scored at least once this season, capped at 100 entries — that's
  fine here, since anyone not on that list simply has 0 goals.
- Team names on player cards are just labels you type in — they aren't
  validated against anything.
- Editing entries requires git access (or asking whoever maintains the
  repo to add a pull request). There's no in-browser save.
