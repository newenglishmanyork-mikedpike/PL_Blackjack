// Pulls Premier League top-scorer data from football-data.org and writes data/scores.json.
// Requires FOOTBALL_DATA_TOKEN in the environment (a free key from https://www.football-data.org/client/register).
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const token = process.env.FOOTBALL_DATA_TOKEN;
if (!token) {
  console.error('Missing FOOTBALL_DATA_TOKEN environment variable.');
  process.exit(1);
}

const API_BASE = 'https://api.football-data.org/v4';
// football-data.org's free tier only returns goalscorers (limit is capped server-side on the free plan).
const SCORERS_URL = `${API_BASE}/competitions/PL/scorers?limit=100`;

const res = await fetch(SCORERS_URL, { headers: { 'X-Auth-Token': token } });

if (!res.ok) {
  const body = await res.text().catch(() => '');
  console.error(`football-data.org request failed: ${res.status} ${res.statusText}\n${body}`);
  process.exit(1);
}

const json = await res.json();
const scorers = Array.isArray(json.scorers) ? json.scorers : [];

const goals = {};
for (const s of scorers) {
  const name = s.player && s.player.name;
  if (!name) continue;
  const key = name.trim().toLowerCase();
  goals[key] = Number(s.goals) || 0;
}

const output = {
  updatedAt: new Date().toISOString(),
  season: json.season && json.season.startDate ? json.season.startDate.slice(0, 4) : null,
  scorersReturned: scorers.length,
  goals,
};

const outPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'scores.json');
await writeFile(outPath, JSON.stringify(output, null, 2) + '\n', 'utf8');

console.log(`Wrote ${Object.keys(goals).length} players' goal counts to data/scores.json (season ${output.season}).`);
