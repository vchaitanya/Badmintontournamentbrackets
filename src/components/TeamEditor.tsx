import { Users } from 'lucide-react';
import { Team } from './TournamentManager';

type Props = {
  team: Team;
  onUpdate: (players: string) => void;
};

export function TeamEditor({ team, onUpdate }: Props) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-lg border border-gray-200 p-3">
      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 rounded-lg shrink-0">
        <Users className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="text-gray-900 mb-1">{team.label}</div>
        <input
          type="text"
          value={team.players}
          onChange={(e) => onUpdate(e.target.value)}
          placeholder="Enter player names"
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        />
      </div>
    </div>
  );
}
