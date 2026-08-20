import LevelRing from "../components/LevelRing.jsx";
import { Flame, Star, Trophy, Coins } from "lucide-react";
import { useGame } from "../game/GameContext.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Profile() {
  const { player, xpCap, rank } = useGame();
  const { user } = useAuth();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-6 mb-6">
        <div className="w-16 h-16 rounded-full bg-teal/20 text-teal flex items-center justify-center text-2xl font-semibold">
          {user?.name[0]}
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold">{user?.name || "Guest"}</p>
          <p className="text-sm text-gray-400">{rank}</p>
        </div>
        <LevelRing
          level={player.level}
          xp={player.xp}
          xpCap={xpCap}
          size={64}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl px-4 py-4 flex items-center gap-3">
          <Flame size={20} className="text-orange-400" />
          <div>
            <p className="text-lg font-semibold leading-none">
              {player.currentStreak} days
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Longest streak: {player.longestStreak}
            </p>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl px-4 py-4 flex items-center gap-3">
          <Star size={20} className="text-teal" />
          <div>
            <p className="text-lg font-semibold leading-none">
              {player.totalXpEarned} XP
            </p>
            <p className="text-xs text-gray-400 mt-1">Total earned</p>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl px-4 py-4 flex items-center gap-3">
          <Coins size={20} className="text-gold" />
          <div>
            <p className="text-lg font-semibold leading-none">{player.coins}</p>
            <p className="text-xs text-gray-400 mt-1">Coins</p>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl px-4 py-4 flex items-center gap-3">
          <Trophy size={20} className="text-gold" />
          <div>
            <p className="text-lg font-semibold leading-none">6</p>
            <p className="text-xs text-gray-400 mt-1">Badges earned</p>
          </div>
        </div>
      </div>
    </div>
  );
}
