import { Clock, MapPin, Trophy } from 'lucide-react';
import { Match, Team } from './TournamentManager';

type Props = {
  match: Match;
  teams: Team[];
  categoryColor: string;
  eventName: string;
  onUpdate: (updates: Partial<Match>) => void;
  allowTeamEdit?: boolean;
};

export function MatchCard({ match, teams, categoryColor, eventName, onUpdate, allowTeamEdit = false }: Props) {
  const getTeamDisplay = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return teamId;
    return team.players ? `${team.label} - ${team.players}` : team.label;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 ${categoryColor} text-white rounded text-sm`}>
          {match.label}
        </span>
        {match.winner && (
          <span className="flex items-center gap-1 text-green-600 text-sm">
            <Trophy className="w-4 h-4" />
            Winner: {match.winner}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="space-y-2 mb-4">
        {allowTeamEdit ? (
          <>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Team 1</label>
              <select
                value={match.team1}
                onChange={(e) => onUpdate({ team1: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                <option value="">Select team...</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.players ? `${team.label} - ${team.players}` : team.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Team 2</label>
              <select
                value={match.team2}
                onChange={(e) => onUpdate({ team2: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                <option value="">Select team...</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.players ? `${team.label} - ${team.players}` : team.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <>
            <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200">
              <span className="text-gray-900">{getTeamDisplay(match.team1)}</span>
            </div>
            <div className="text-center text-gray-400">vs</div>
            <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200">
              <span className="text-gray-900">{getTeamDisplay(match.team2)}</span>
            </div>
          </>
        )}
      </div>

      {/* Time and Court */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="flex items-center gap-1 text-gray-600 text-sm mb-1">
            <Clock className="w-3 h-3" />
            Time
          </label>
          <input
            type="text"
            value={match.time}
            onChange={(e) => onUpdate({ time: e.target.value })}
            placeholder="e.g. 5:30-6:00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="flex items-center gap-1 text-gray-600 text-sm mb-1">
            <MapPin className="w-3 h-3" />
            Court
          </label>
          <input
            type="text"
            value={match.court}
            onChange={(e) => onUpdate({ court: e.target.value })}
            placeholder="e.g. 1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Score and Winner */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-gray-600 text-sm mb-1">Score</label>
          <input
            type="text"
            value={match.score}
            onChange={(e) => onUpdate({ score: e.target.value })}
            placeholder="e.g. 21-19, 21-18"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-gray-600 text-sm mb-1">Winner</label>
          <select
            value={match.winner}
            onChange={(e) => onUpdate({ winner: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
          >
            <option value="">-</option>
            {match.team1 && <option value={match.team1}>{match.team1}</option>}
            {match.team2 && <option value={match.team2}>{match.team2}</option>}
          </select>
        </div>
      </div>
    </div>
  );
}