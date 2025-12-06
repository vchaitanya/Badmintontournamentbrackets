import { useState, useEffect } from 'react';
import { Team, Match } from './TournamentManager';
import { MatchCard } from './MatchCard';
import { TeamEditor } from './TeamEditor';

type Props = {
  eventName: string;
  eventId: string;
  categoryColor: string;
  poolCount: number;
  teamsPerPool: number;
  advancePerPool: number;
};

export function PoolEvent({ eventName, eventId, categoryColor, poolCount, teamsPerPool, advancePerPool }: Props) {
  const totalTeams = poolCount * teamsPerPool;

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem(`${eventId}_teams`);
    if (saved) return JSON.parse(saved);
    return Array.from({ length: totalTeams }, (_, i) => ({
      id: `T${i + 1}`,
      label: `T${i + 1}`,
      players: '',
    }));
  });

  const [poolMatches, setPoolMatches] = useState<Match[][]>(() => {
    const saved = localStorage.getItem(`${eventId}_poolMatches`);
    if (saved) return JSON.parse(saved);
    
    const pools: Match[][] = [];
    let matchNum = 1;

    for (let pool = 0; pool < poolCount; pool++) {
      const poolMatchList: Match[] = [];
      const startTeam = pool * teamsPerPool;

      for (let i = 0; i < teamsPerPool; i++) {
        for (let j = i + 1; j < teamsPerPool; j++) {
          poolMatchList.push({
            id: `M${matchNum}`,
            label: `M${matchNum}`,
            team1: `T${startTeam + i + 1}`,
            team2: `T${startTeam + j + 1}`,
            time: '',
            court: '',
            winner: '',
            score: '',
          });
          matchNum++;
        }
      }
      pools.push(poolMatchList);
    }
    return pools;
  });

  const [semiFinals, setSemiFinals] = useState<Match[]>(() => {
    const saved = localStorage.getItem(`${eventId}_semiFinals`);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'SF1',
        label: 'SF1',
        team1: '',
        team2: '',
        time: '',
        court: '',
        winner: '',
        score: '',
      },
      {
        id: 'SF2',
        label: 'SF2',
        team1: '',
        team2: '',
        time: '',
        court: '',
        winner: '',
        score: '',
      },
    ];
  });

  const [finals, setFinals] = useState<Match>(() => {
    const saved = localStorage.getItem(`${eventId}_finals`);
    if (saved) return JSON.parse(saved);
    return {
      id: 'F1',
      label: 'F1',
      team1: '',
      team2: '',
      time: '',
      court: '',
      winner: '',
      score: '',
    };
  });

  const [thirdPlace, setThirdPlace] = useState<Match>(() => {
    const saved = localStorage.getItem(`${eventId}_thirdPlace`);
    if (saved) return JSON.parse(saved);
    return {
      id: '3RD',
      label: '3RD',
      team1: '',
      team2: '',
      time: '',
      court: '',
      winner: '',
      score: '',
    };
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(`${eventId}_teams`, JSON.stringify(teams));
  }, [teams, eventId]);

  useEffect(() => {
    localStorage.setItem(`${eventId}_poolMatches`, JSON.stringify(poolMatches));
    // Save to global for schedule view
    const allMatches = JSON.parse(localStorage.getItem('allMatches') || '{}');
    const flatMatches = poolMatches.flat();
    allMatches[eventId] = { 
      matches: flatMatches, 
      eventName, 
      categoryColor,
      teams 
    };
    localStorage.setItem('allMatches', JSON.stringify(allMatches));
  }, [poolMatches, eventId, eventName, categoryColor, teams]);

  useEffect(() => {
    localStorage.setItem(`${eventId}_semiFinals`, JSON.stringify(semiFinals));
    const allMatches = JSON.parse(localStorage.getItem('allMatches') || '{}');
    if (!allMatches[eventId]) allMatches[eventId] = { matches: [], eventName, categoryColor, teams };
    allMatches[eventId].semiFinals = semiFinals;
    localStorage.setItem('allMatches', JSON.stringify(allMatches));
  }, [semiFinals, eventId, eventName, categoryColor, teams]);

  useEffect(() => {
    localStorage.setItem(`${eventId}_finals`, JSON.stringify(finals));
    const allMatches = JSON.parse(localStorage.getItem('allMatches') || '{}');
    if (!allMatches[eventId]) allMatches[eventId] = { matches: [], eventName, categoryColor, teams };
    allMatches[eventId].finals = [finals];
    localStorage.setItem('allMatches', JSON.stringify(allMatches));
  }, [finals, eventId, eventName, categoryColor, teams]);

  useEffect(() => {
    localStorage.setItem(`${eventId}_thirdPlace`, JSON.stringify(thirdPlace));
    const allMatches = JSON.parse(localStorage.getItem('allMatches') || '{}');
    if (!allMatches[eventId]) allMatches[eventId] = { matches: [], eventName, categoryColor, teams };
    allMatches[eventId].thirdPlace = [thirdPlace];
    localStorage.setItem('allMatches', JSON.stringify(allMatches));
  }, [thirdPlace, eventId, eventName, categoryColor, teams]);

  const updateTeam = (teamId: string, players: string) => {
    setTeams(teams.map((t) => (t.id === teamId ? { ...t, players } : t)));
  };

  const updatePoolMatch = (poolIdx: number, matchId: string, updates: Partial<Match>) => {
    setPoolMatches(
      poolMatches.map((pool, idx) =>
        idx === poolIdx
          ? pool.map((m) => (m.id === matchId ? { ...m, ...updates } : m))
          : pool
      )
    );
  };

  const updateSemiFinal = (matchId: string, updates: Partial<Match>) => {
    setSemiFinals(semiFinals.map((m) => (m.id === matchId ? { ...m, ...updates } : m)));
  };

  const updateFinal = (updates: Partial<Match>) => {
    setFinals({ ...finals, ...updates });
  };

  const updateThirdPlace = (updates: Partial<Match>) => {
    setThirdPlace({ ...thirdPlace, ...updates });
  };

  const getPoolStandings = (poolIdx: number) => {
    const startTeam = poolIdx * teamsPerPool;
    const poolTeams = teams.slice(startTeam, startTeam + teamsPerPool);
    const matches = poolMatches[poolIdx];

    const standings = poolTeams.map((team) => {
      const teamMatches = matches.filter((m) => m.team1 === team.id || m.team2 === team.id);
      const wins = teamMatches.filter((m) => m.winner === team.id).length;
      const played = teamMatches.filter((m) => m.winner !== '').length;
      return { ...team, wins, played };
    });

    return standings.sort((a, b) => b.wins - a.wins);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">{eventName}</h2>
        <p className="text-gray-600">
          {poolCount} Pools of {teamsPerPool} • Top {advancePerPool} from each pool to Semifinals
        </p>
      </div>

      {/* Team Management */}
      <div className="mb-8">
        <h3 className="text-gray-900 mb-4">Teams</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {teams.map((team) => (
            <TeamEditor
              key={team.id}
              team={team}
              onUpdate={(players) => updateTeam(team.id, players)}
            />
          ))}
        </div>
      </div>

      {/* Pool Matches */}
      {Array.from({ length: poolCount }).map((_, poolIdx) => {
        const standings = getPoolStandings(poolIdx);
        return (
          <div key={poolIdx} className="mb-8">
            <h3 className="text-gray-900 mb-4">Pool {String.fromCharCode(65 + poolIdx)}</h3>

            <div className="mb-4">
              <h4 className="text-gray-700 mb-3">Matches</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {poolMatches[poolIdx].map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    teams={teams}
                    categoryColor={categoryColor}
                    eventName={eventName}
                    onUpdate={(updates) => updatePoolMatch(poolIdx, match.id, updates)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-gray-700 mb-3">Standings</h4>
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-700">Rank</th>
                      <th className="text-left px-4 py-3 text-gray-700">Team</th>
                      <th className="text-left px-4 py-3 text-gray-700">Players</th>
                      <th className="text-left px-4 py-3 text-gray-700">Wins</th>
                      <th className="text-left px-4 py-3 text-gray-700">Played</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((team, idx) => (
                      <tr
                        key={team.id}
                        className={`border-b border-gray-100 last:border-0 ${
                          idx < advancePerPool ? 'bg-green-50' : ''
                        }`}
                      >
                        <td className="px-4 py-3 text-gray-900">{idx + 1}</td>
                        <td className="px-4 py-3 text-gray-900">{team.label}</td>
                        <td className="px-4 py-3 text-gray-600">{team.players || '-'}</td>
                        <td className="px-4 py-3 text-gray-900">{team.wins}</td>
                        <td className="px-4 py-3 text-gray-600">{team.played}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}

      {/* Semifinals */}
      <div className="mb-8">
        <h3 className="text-gray-900 mb-4">Semifinals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {semiFinals.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              teams={teams}
              categoryColor={categoryColor}
              eventName={eventName}
              onUpdate={(updates) => updateSemiFinal(match.id, updates)}
              allowTeamEdit
            />
          ))}
        </div>
      </div>

      {/* Finals & Third Place */}
      <div>
        <h3 className="text-gray-900 mb-4">Finals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MatchCard
            match={finals}
            teams={teams}
            categoryColor={categoryColor}
            eventName={eventName}
            onUpdate={updateFinal}
            allowTeamEdit
          />
          <MatchCard
            match={thirdPlace}
            teams={teams}
            categoryColor={categoryColor}
            eventName={eventName}
            onUpdate={updateThirdPlace}
            allowTeamEdit
          />
        </div>
      </div>
    </div>
  );
}