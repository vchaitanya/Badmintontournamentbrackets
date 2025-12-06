import { useState, useEffect } from 'react';
import { Printer } from 'lucide-react';
import { Match, Team } from './TournamentManager';

type ScheduleSlot = {
  time: string;
  courts: {
    [court: string]: {
      matchLabel: string;
      team1: string;
      team2: string;
      eventName: string;
      categoryColor: string;
      score: string;
    } | null;
  };
};

export function ScheduleView() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setRefreshKey((prev) => prev + 1);
    };

    // Listen for custom storage event
    window.addEventListener('tournamentDataUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('tournamentDataUpdated', handleStorageChange);
    };
  }, []);

  const timeSlots = [
    '5:30-6:00',
    '6:00-6:30',
    '6:30-7:00',
    '7:00-7:30',
    '7:30-8:00',
    '8:00-8:30',
    '8:30-9:00',
    '9:00-9:30',
    '9:30-10:00',
    '10:00-10:30',
    '10:30-11:00',
  ];

  const courts = ['1', '2', '3', '4'];

  const handlePrint = () => {
    window.print();
  };

  // Collect all matches from all events
  const allEventsData = JSON.parse(localStorage.getItem('allMatches') || '{}');

  const getTeamLabel = (teamId: string, teams: Team[], matchLabel: string) => {
    if (!teamId) {
      // Show placeholder for matches where teams aren't determined yet
      return `TBD (${matchLabel})`;
    }
    const team = teams.find((t) => t.id === teamId);
    if (!team) return teamId;
    return team.players ? team.players : team.label;
  };

  // Build schedule grid
  const schedule: ScheduleSlot[] = timeSlots.map((time) => ({
    time,
    courts: Object.fromEntries(courts.map((c) => [c, null])),
  }));

  // Populate schedule from all events
  Object.values(allEventsData).forEach((eventData: any) => {
    const { matches = [], semiFinals = [], quarterFinals = [], finals = [], thirdPlace = [], eventName, categoryColor, teams } = eventData;

    const allMatches = [
      ...matches,
      ...(semiFinals || []),
      ...(quarterFinals || []),
      ...(finals || []),
      ...(thirdPlace || []),
    ];

    allMatches.forEach((match: Match) => {
      if (match.time && match.court) {
        const slot = schedule.find((s) => s.time === match.time);
        if (slot && courts.includes(match.court)) {
          slot.courts[match.court] = {
            matchLabel: match.label,
            team1: getTeamLabel(match.team1, teams, match.label),
            team2: getTeamLabel(match.team2, teams, match.label),
            eventName,
            categoryColor,
            score: match.score,
          };
        }
      }
    });
  });

  return (
    <div key={refreshKey}>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div>
          <h2 className="text-gray-900 mb-1">Tournament Schedule</h2>
          <p className="text-gray-600">Complete schedule across all courts</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print Schedule
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 print:mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-700">Men&apos;s Doubles 35+</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pink-500 rounded"></div>
          <span className="text-sm text-gray-700">Women&apos;s Doubles</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span className="text-sm text-gray-700">Mixed Doubles</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-700">Men&apos;s Doubles</span>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-3 py-2 text-left text-gray-700 min-w-[100px]">
                Time
              </th>
              {courts.map((court) => (
                <th
                  key={court}
                  className="border border-gray-200 px-3 py-2 text-left text-gray-700 min-w-[200px]"
                >
                  Court {court}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedule.map((slot) => (
              <tr key={slot.time}>
                <td className="border border-gray-200 px-3 py-3 text-gray-900 align-top">
                  {slot.time}
                </td>
                {courts.map((court) => {
                  const match = slot.courts[court];
                  return (
                    <td
                      key={court}
                      className={`border border-gray-200 px-3 py-2 align-top ${
                        match ? match.categoryColor.replace('bg-', 'bg-opacity-10 bg-') : ''
                      }`}
                    >
                      {match ? (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-0.5 ${match.categoryColor} text-white rounded text-xs`}
                            >
                              {match.matchLabel}
                            </span>
                            <span className="text-xs text-gray-600">{match.eventName}</span>
                          </div>
                          <div className="text-sm text-gray-900 mb-0.5">{match.team1}</div>
                          <div className="text-xs text-gray-500 mb-0.5">vs</div>
                          <div className="text-sm text-gray-900 mb-1">{match.team2}</div>
                          {match.score && (
                            <div className="text-xs text-gray-600">Score: {match.score}</div>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm">-</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}