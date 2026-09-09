// Pulls Premier League top-scorer, standings, and fixture data from
// football-data.org and writes data/scores.json.
// Requires FOOTBALL_DATA_TOKEN in the environment (a free key from https://www.football-data.org/client/register).
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const token = process.env.FOOTBALL_DATA_TOKEN;
if (!token) {
  console.error('Missing FOOTBALL_DATA_TOKEN environment variable.');
  process.exit(1);
}

const API_BASE = 'https://api.football-data.org/v4';
const PL_TOTAL_GAMES_PER_TEAM = 38; // 20-team league, double round-robin
const MAX_RECENT_GOALS = 12;

const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data');
const outPath = path.join(dataDir, 'scores.json');
const entriesPath = path.join(dataDir, 'entries.json');

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
    .replace(/ø/gi, 'o').replace(/æ/gi, 'ae').replace(/đ/gi, 'd').replace(/ł/gi, 'l').replace(/ß/g, 'ss')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

let previous = {};
try {
  previous = JSON.parse(await readFile(outPath, 'utf8'));
} catch {
  // No existing scores.json yet (first run) — fine, just means no diff/history.
}
const previousPlayers = previous.players || {};
const previousRecentGoals = Array.isArray(previous.recentGoals) ? previous.recentGoals : [];

let draftedNames = new Set();
try {
  const entries = JSON.parse(await readFile(entriesPath, 'utf8'));
  for (const entry of entries) {
    for (const p of entry.players || []) {
      draftedNames.add(normalizeName(p.name));
    }
  }
} catch (err) {
  console.error(`Couldn't read entries.json for the goals ticker (continuing without it): ${err.message}`);
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
    name,
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

// Approximate "when did this goal happen" using each team's most recent
// FINISHED match — we don't have real goal-event timestamps on the free
// tier, so a newly-increased tally gets attributed to the team's latest
// completed fixture as of this refresh.
const matchesJson = await apiGet('/competitions/PL/matches?status=FINISHED');
const matches = Array.isArray(matchesJson.matches) ? matchesJson.matches : [];
const lastMatchByTeam = {};
for (const m of matches) {
  if (!m.homeTeam || !m.awayTeam || !m.utcDate) continue;
  for (const [teamId, isHome] of [[m.homeTeam.id, true], [m.awayTeam.id, false]]) {
    const existing = lastMatchByTeam[teamId];
    if (!existing || new Date(m.utcDate) > new Date(existing.date)) {
      lastMatchByTeam[teamId] = {
        date: m.utcDate,
        opponentName: isHome ? m.awayTeam.name : m.homeTeam.name,
        isHome,
      };
    }
  }
}

const newGoalEvents = [];
for (const [key, stat] of Object.entries(players)) {
  if (!draftedNames.has(key)) continue;
  const oldGoals = previousPlayers[key] ? Number(previousPlayers[key].goals) || 0 : 0;
  const delta = stat.goals - oldGoals;
  if (delta <= 0) continue;
  const lastMatch = stat.teamId ? lastMatchByTeam[stat.teamId] : null;
  if (!lastMatch) continue; // can't attribute a match yet (e.g. team hasn't played)
  newGoalEvents.push({
    player: stat.name,
    teamName: stat.teamName,
    delta,
    goalsAfter: stat.goals,
    opponent: lastMatch.opponentName,
    isHome: lastMatch.isHome,
    matchDate: lastMatch.date,
    detectedAt: new Date().toISOString(),
  });
}

const recentGoals = [...newGoalEvents, ...previousRecentGoals].slice(0, MAX_RECENT_GOALS);

const output = {
  updatedAt: new Date().toISOString(),
  season: scorersJson.season && scorersJson.season.startDate ? scorersJson.season.startDate.slice(0, 4) : null,
  scorersReturned: scorers.length,
  players,
  teams,
  recentGoals,
};

await writeFile(outPath, JSON.stringify(output, null, 2) + '\n', 'utf8');

console.log(`Wrote ${Object.keys(players).length} players and ${Object.keys(teams).length} teams to data/scores.json (season ${output.season}). ${newGoalEvents.length} new drafted-player goal event(s) logged.`);
