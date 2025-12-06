import { useState, useEffect } from 'react';
import { Team, Match } from './TournamentManager';
import { MatchCard } from './MatchCard';
import { TeamEditor } from './TeamEditor';

type Props = {
  eventName: string;
  eventId: string;
  categoryColor: string;
  totalTeams: number;
};

export function KnockoutEvent({ eventName, eventId, categoryColor, totalTeams }: Props) {
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem(`${eventId}_teams`);
    if (saved) return JSON.parse(saved);
    return Array.from({ length: totalTeams }, (_, i) => ({
      id: `T${i + 1}`,
      label: `T${i + 1}`,
      players: '',
    }));
  });

  const [round1Matches, setRound1Matches] = useState<Match[]>(() => {
    const saved = localStorage.getItem(`${eventId}_round1`);
    if (saved) return JSON.parse(saved);
    const matches: Match[] = [];
    for (let i = 0; i < 6; i++) {
      matches.push({
        id: `R1-${i + 1}`,
        label: `R1-${i + 1}`,
        team1: `T${i * 2 + 1}`,
        team2: `T${i * 2 + 2}`,
        time: '',
        court: '',
        winner: '',
        score: '',
      });
    }
    return matches;
  });

  const [luckyLosers, setLuckyLosers] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${eventId}_luckyLosers`);
    if (saved) return JSON.parse(saved);
    return ['', ''];
  });

  const [quarterFinals, setQuarterFinals] = useState<Match[]>(() => {
    const saved = localStorage.getItem(`${eventId}_qf`);
    if (saved) return JSON.parse(saved);
    return Array.from({ length: 4 }, (_, i) => ({
      id: `QF${i + 1}`,
      label: `QF${i + 1}`,
      team1: '',
      team2: '',
      time: '',
      court: '',
      winner: '',
      score: '',
    }));
  });

  const [semiFinals, setSemiFinals] = useState<Match[]>(() => {
    const saved = localStorage.getItem(`${eventId}_sf`);
    if (saved) return JSON.parse(saved);
    return Array.from({ length: 2 }, (_, i) => ({
      id: `SF${i + 1}`,
      label: `SF${i + 1}`,
      team1: '',
      team2: '',
      time: '',
      court: '',
      winner: '',
      score: '',
    }));
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
    localStorage.setItem(`${eventId}_round1`, JSON.stringify(round1Matches));
    const allMatches = JSON.parse(localStorage.getItem('allMatches') || '{}');
    allMatches[eventId] = { 
      matches: round1Matches, 
      eventName, 
      categoryColor,
      teams 
    };
    localStorage.setItem('allMatches', JSON.stringify(allMatches));
  }, [round1Matches, eventId, eventName, categoryColor, teams]);

  useEffect(() => {
    localStorage.setItem(`${eventId}_luckyLosers`, JSON.stringify(luckyLosers));
  }, [luckyLosers, eventId]);

  useEffect(() => {
    localStorage.setItem(`${eventId}_qf`, JSON.stringify(quarterFinals));
    const allMatches = JSON.parse(localStorage.getItem('allMatches') || '{}');
    if (!allMatches[eventId]) allMatches[eventId] = { matches: [], eventName, categoryColor, teams };
    allMatches[eventId].quarterFinals = quarterFinals;
    localStorage.setItem('allMatches', JSON.stringify(allMatches));
  }, [quarterFinals, eventId, eventName, categoryColor, teams]);

  useEffect(() => {
    localStorage.setItem(`${eventId}_sf`, JSON.stringify(semiFinals));
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

  const updateRound1Match = (matchId: string, updates: Partial<Match>) => {
    setRound1Matches(round1Matches.map((m) => (m.id === matchId ? { ...m, ...updates } : m)));
  };

  const updateQF = (matchId: string, updates: Partial<Match>) => {
    setQuarterFinals(quarterFinals.map((m) => (m.id === matchId ? { ...m, ...updates } : m)));
  };

  const updateSF = (matchId: string, updates: Partial<Match>) => {
    setSemiFinals(semiFinals.map((m) => (m.id === matchId ? { ...m, ...updates } : m)));
  };

  const updateFinal = (updates: Partial<Match>) => {
    setFinals({ ...finals, ...updates });
  };

  const updateThirdPlace = (updates: Partial<Match>) => {
    setThirdPlace({ ...thirdPlace, ...updates });
  };

  const getFirstRoundLosers = () => {
    return round1Matches
      .filter((m) => m.winner !== '')
      .map((m) => {
        const loser = m.winner === m.team1 ? m.team2 : m.team1;
        return { teamId: loser, matchId: m.id };
      });
  };

  const firstRoundLosers = getFirstRoundLosers();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">{eventName}</h2>
        <p className="text-gray-600">
          Knockout format • 6 R1 winners + 2 lucky losers advance to QF
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

      {/* Round 1 */}
      <div className="mb-8">
        <h3 className="text-gray-900 mb-4">Round 1</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {round1Matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              teams={teams}
              categoryColor={categoryColor}
              eventName={eventName}
              onUpdate={(updates) => updateRound1Match(match.id, updates)}
            />
          ))}
        </div>
      </div>

      {/* Lucky Losers Selection */}
      <div className="mb-8">
        <h3 className="text-gray-900 mb-4">Lucky Losers Selection</h3>
        <p className="text-gray-600 mb-4">
          Select 2 teams from the Round 1 losers to advance to Quarterfinals
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1].map((idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <label className="block text-gray-700 mb-2">Lucky Loser {idx + 1}</label>
              <select
                value={luckyLosers[idx]}
                onChange={(e) => {
                  const newLosers = [...luckyLosers];
                  newLosers[idx] = e.target.value;
                  setLuckyLosers(newLosers);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="">Select team...</option>
                {firstRoundLosers.map(({ teamId }) => {
                  const team = teams.find((t) => t.id === teamId);
                  return (
                    <option key={teamId} value={teamId}>
                      {teamId} {team?.players ? `- ${team.players}` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Quarterfinals */}
      <div className="mb-8">
        <h3 className="text-gray-900 mb-4">Quarterfinals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quarterFinals.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              teams={teams}
              categoryColor={categoryColor}
              eventName={eventName}
              onUpdate={(updates) => updateQF(match.id, updates)}
              allowTeamEdit
            />
          ))}
        </div>
      </div>

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
              onUpdate={(updates) => updateSF(match.id, updates)}
              allowTeamEdit
            />
          ))}
        </div>
      </div>

      {/* Finals */}
      <div>
        <h3 className="text-gray-900 mb-4">Finals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MatchCard match={finals} teams={teams} categoryColor={categoryColor} eventName={eventName} onUpdate={updateFinal} allowTeamEdit />
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