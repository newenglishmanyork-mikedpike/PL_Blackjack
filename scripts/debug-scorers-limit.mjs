// Temporary diagnostic — checking whether football-data.org's free tier
// scorers endpoint can return more than 100 entries (via a higher limit
// or offset/pagination), since we suspect the current limit=100 cap is
// now cutting off single-goal scorers like Foden as the season progresses.
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

const r100 = await apiGet('/competitions/PL/scorers?limit=100');
console.log('limit=100 returned:', r100?.scorers?.length, 'count field:', r100?.count);
console.log('last entry goals:', r100?.scorers?.[r100.scorers.length - 1]?.goals);

const r500 = await apiGet('/competitions/PL/scorers?limit=500');
console.log('limit=500 returned:', r500?.scorers?.length, 'count field:', r500?.count);

const rOffset = await apiGet('/competitions/PL/scorers?limit=100&offset=100');
console.log('offset=100 returned:', rOffset?.scorers?.length);
if (rOffset?.scorers?.length) {
  console.log('first entry at offset 100:', JSON.stringify(rOffset.scorers[0]));
}

// Check standings for total goals scored league-wide, to sanity check
// how many distinct scorers might plausibly exist by now.
const standings = await apiGet('/competitions/PL/standings');
const table = (standings?.standings || []).find(s => s.type === 'TOTAL');
if (table) {
  const totalGoals = table.table.reduce((s, row) => s + (row.goalsFor || 0), 0);
  console.log('total league goals scored so far (goalsFor sum):', totalGoals);
}
