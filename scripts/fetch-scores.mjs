// Pulls Premier League top-scorer and standings data from football-data.org
// and writes data/scores.json.
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
const PL_TOTAL_GAMES_PER_TEAM = 38; // 20-team league, double round-robin

async function apiGet(pathname) {
  const res = await fetch(`${API_BASE}${pathname}`, { headers: { 'X-Auth-Token': token } });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`football-data.org request failed for ${pathname}: ${res.status} ${res.statusText}\n${body}`);
  }
  return res.json();
}

// Matches the normalization in index.html: case/accent/punctuation-insensitive,
// so "Kiernan Dewsbury-Hall" and "kiernan dewsbury hall" land on the same key.
function normalizeName(name) {
  return (name || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/ø/gi, 'o').replace(/æ/gi, 'ae').replace(/đ/gi, 'd').replace(/ł/gi, 'l')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

const scorersJson = await apiGet('/competitions/PL/scorers?limit=100');
const scorers = Array.isArray(scorersJson.scorers) ? scorersJson.scorers : [];

// football-data.org's free tier only returns goalscorers (players with 0
// league goals never appear here — that's fine, they just default to 0).
const players = {};
for (const s of scorers) {
  const name = s.player && s.player.name;
  if (!name) continue;
  const key = normalizeName(name);
  players[key] = {
    goals: Number(s.goals) || 0,
    playedMatches: Number(s.playedMatches) || 0,
    teamId: s.team ? s.team.id : null,
    teamName: s.team ? s.team.name : null,
  };
}

const standingsJson = await apiGet('/competitions/PL/standings');
const totalTable = (standingsJson.standings || []).find(s => s.type === 'TOTAL');
const teams = {};
for (const row of (totalTable && totalTable.table) || []) {
  if (!row.team) continue;
  teams[row.team.id] = {
    name: row.team.name,
    playedGames: Number(row.playedGames) || 0,
    gamesRemaining: Math.max(0, PL_TOTAL_GAMES_PER_TEAM - (Number(row.playedGames) || 0)),
  };
}

const output = {
  updatedAt: new Date().toISOString(),
  season: scorersJson.season && scorersJson.season.startDate ? scorersJson.season.startDate.slice(0, 4) : null,
  scorersReturned: scorers.length,
  players,
  teams,
};

const outPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'scores.json');
await writeFile(outPath, JSON.stringify(output, null, 2) + '\n', 'utf8');

console.log(`Wrote ${Object.keys(players).length} players and ${Object.keys(teams).length} teams to data/scores.json (season ${output.season}).`);
