import { useState, useEffect } from 'react';
import { Team, Match } from './TournamentManager';
import { MatchCard } from './MatchCard';
import { TeamEditor } from './TeamEditor';

type Props = {
  eventName: string;
  eventId: string;
  categoryColor: string;
  teamCount: number;
  finalsCount: number;
};

export function RoundRobinEvent({ eventName, eventId, categoryColor, teamCount, finalsCount }: Props) {
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem(`${eventId}_teams`);
    if (saved) return JSON.parse(saved);
    return Array.from({ length: teamCount }, (_, i) => ({
      id: `T${i + 1}`,
      label: `T${i + 1}`,
      players: '',
    }));
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem(`${eventId}_matches`);
    if (saved) return JSON.parse(saved);
    
    const roundRobinMatches: Match[] = [];
    let matchNum = 1;
    for (let i = 0; i < teamCount; i++) {
      for (let j = i + 1; j < teamCount; j++) {
        roundRobinMatches.push({
          id: `M${matchNum}`,
          label: `M${matchNum}`,
          team1: `T${i + 1}`,
          team2: `T${j + 1}`,
          time: '',
          court: '',
          winner: '',
          score: '',
        });
        matchNum++;
      }
    }
    return roundRobinMatches;
  });

  const [finals, setFinals] = useState<Match[]>(() => {
    const saved = localStorage.getItem(`${eventId}_finals`);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: `F1`,
        label: 'F1',
        team1: '',
        team2: '',
        time: '',
        court: '',
        winner: '',
        score: '',
      },
    ];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(`${eventId}_teams`, JSON.stringify(teams));
  }, [teams, eventId]);

  useEffect(() => {
    localStorage.setItem(`${eventId}_matches`, JSON.stringify(matches));
    // Also save to a global matches list for schedule view
    const allMatches = JSON.parse(localStorage.getItem('allMatches') || '{}');
    allMatches[eventId] = { 
      matches, 
      eventName, 
      categoryColor,
      teams 
    };
    localStorage.setItem('allMatches', JSON.stringify(allMatches));
  }, [matches, eventId, eventName, categoryColor, teams]);

  useEffect(() => {
    localStorage.setItem(`${eventId}_finals`, JSON.stringify(finals));
    // Also save finals to global matches
    const allMatches = JSON.parse(localStorage.getItem('allMatches') || '{}');
    if (!allMatches[eventId]) allMatches[eventId] = { matches: [], eventName, categoryColor, teams };
    allMatches[eventId].finals = finals;
    localStorage.setItem('allMatches', JSON.stringify(allMatches));
  }, [finals, eventId, eventName, categoryColor, teams]);

  const updateTeam = (teamId: string, players: string) => {
    setTeams(teams.map((t) => (t.id === teamId ? { ...t, players } : t)));
  };

  const updateMatch = (matchId: string, updates: Partial<Match>) => {
    setMatches(matches.map((m) => (m.id === matchId ? { ...m, ...updates } : m)));
  };

  const updateFinal = (matchId: string, updates: Partial<Match>) => {
    setFinals(finals.map((m) => (m.id === matchId ? { ...m, ...updates } : m)));
  };

  const getTeamStandings = () => {
    const standings = teams.map((team) => {
      const teamMatches = matches.filter(
        (m) => m.team1 === team.id || m.team2 === team.id
      );
      const wins = teamMatches.filter((m) => m.winner === team.id).length;
      const played = teamMatches.filter((m) => m.winner !== '').length;
      return { ...team, wins, played };
    });
    return standings.sort((a, b) => b.wins - a.wins);
  };

  const standings = getTeamStandings();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">{eventName}</h2>
        <p className="text-gray-600">Round Robin format • Top {finalsCount} to Finals</p>
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

      {/* Round Robin Matches */}
      <div className="mb-8">
        <h3 className="text-gray-900 mb-4">Round Robin Matches</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              teams={teams}
              categoryColor={categoryColor}
              eventName={eventName}
              onUpdate={(updates) => updateMatch(match.id, updates)}
            />
          ))}
        </div>
      </div>

      {/* Standings */}
      <div className="mb-8">
        <h3 className="text-gray-900 mb-4">Standings</h3>
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
                <tr key={team.id} className="border-b border-gray-100 last:border-0">
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

      {/* Finals */}
      <div>
        <h3 className="text-gray-900 mb-4">Finals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {finals.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              teams={teams}
              categoryColor={categoryColor}
              eventName={eventName}
              onUpdate={(updates) => updateFinal(match.id, updates)}
              allowTeamEdit
            />
          ))}
        </div>
      </div>
    </div>
  );
}