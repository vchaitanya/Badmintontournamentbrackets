import { useState } from 'react';
import { Trophy, Users, Clock, MapPin, Calendar } from 'lucide-react';
import { RoundRobinEvent } from './RoundRobinEvent';
import { PoolEvent } from './PoolEvent';
import { KnockoutEvent } from './KnockoutEvent';
import { ScheduleView } from './ScheduleView';

export type Team = {
  id: string;
  label: string;
  players: string;
};

export type Match = {
  id: string;
  label: string;
  team1: string;
  team2: string;
  time: string;
  court: string;
  winner: string;
  score: string;
};

export function TournamentManager() {
  const [activeTab, setActiveTab] = useState('mens35');

  const tabs = [
    { id: 'mens35', name: "Men's Doubles 35+", icon: Trophy },
    { id: 'womens', name: "Women's Doubles", icon: Trophy },
    { id: 'mixed', name: 'Mixed Doubles', icon: Trophy },
    { id: 'mens', name: "Men's Doubles", icon: Trophy },
    { id: 'schedule', name: 'Schedule View', icon: Calendar },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Badminton Tournament Manager</h1>
        <p className="text-gray-600">Manage brackets, schedules, and court assignments</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Event Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'mens35' && (
          <RoundRobinEvent
            eventName="Men's Doubles 35+"
            eventId="mens35"
            categoryColor="bg-blue-500"
            teamCount={4}
            finalsCount={2}
          />
        )}
        {activeTab === 'womens' && (
          <RoundRobinEvent
            eventName="Women's Doubles"
            eventId="womens"
            categoryColor="bg-pink-500"
            teamCount={3}
            finalsCount={2}
          />
        )}
        {activeTab === 'mixed' && (
          <PoolEvent
            eventName="Mixed Doubles"
            eventId="mixed"
            categoryColor="bg-purple-500"
            poolCount={2}
            teamsPerPool={4}
            advancePerPool={2}
          />
        )}
        {activeTab === 'mens' && (
          <KnockoutEvent
            eventName="Men's Doubles"
            eventId="mens"
            categoryColor="bg-green-500"
            totalTeams={12}
          />
        )}
        {activeTab === 'schedule' && <ScheduleView />}
      </div>
    </div>
  );
}