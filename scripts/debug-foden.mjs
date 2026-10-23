// Temporary diagnostic — checking why Foden's goal from last Saturday
// doesn't appear in data/scores.json. Deleted once verification is done.
const token = process.env.FOOTBALL_DATA_TOKEN;
const API_BASE = 'https://api.football-data.org/v4';

async function apiGet(pathname) {
  const res = await fetch(`${API_BASE}${pathname}`, { headers: { 'X-Auth-Token': token } });
  console.log(`GET ${pathname} -> ${res.status}`);
  if (!res.ok) {
    console.log(await res.text().catch(() => ''));
    return null;
  }
  return res.json();
}

const scorers = await apiGet('/competitions/PL/scorers?limit=100');
if (scorers) {
  console.log('scorers count:', scorers.scorers?.length);
  const foden = scorers.scorers?.find(s => /foden/i.test(s.player?.name || ''));
  console.log('Foden in scorers list?', foden ? JSON.stringify(foden) : 'NOT FOUND');
}

const matches = await apiGet('/competitions/PL/matches?status=FINISHED');
if (matches) {
  const cityMatches = (matches.matches || [])
    .filter(m => /manchester city/i.test(m.homeTeam?.name || '') || /manchester city/i.test(m.awayTeam?.name || ''))
    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));
  console.log('\nMost recent Man City matches:');
  for (const m of cityMatches.slice(0, 5)) {
    console.log(m.utcDate, m.homeTeam?.name, m.score?.fullTime?.home, '-', m.score?.fullTime?.away, m.awayTeam?.name, 'id:', m.id);
  }
  const lastCityMatch = cityMatches[0];
  if (lastCityMatch) {
    const detail = await apiGet(`/matches/${lastCityMatch.id}`);
    if (detail) {
      console.log('\nMatch detail top-level keys:', Object.keys(detail));
      console.log('goals field:', JSON.stringify(detail.goals, null, 2));
    }
  }
}
