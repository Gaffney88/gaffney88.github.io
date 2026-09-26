 "use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ChevronDown,
  CircleDot,
  Clock3,
  RefreshCw,
  Server,
  ShieldCheck,
  Users,
} from "lucide-react";

type TeamUser = {
  id: number;
  name: string;
  displayName: string;
  avatar: string;
  presenceType?: number;
};

type GameStat = {
  playing: number;
  visits: number;
  universeId: string;
};

const OWNER_USERNAME = "HARRY2O6";
const MANAGEMENT_USERNAMES = ["ericplane", "Abbinat0r"];
const MAIN_PLACE_ID = "18352872370";
const E2_PLACE_ID = "110170053127507";

const ROLE_OPTIONS = ["All", "Owner", "Management"];
const STATUS_OPTIONS = ["All", "Online", "Offline", "In Game", "Studio"];

function presenceLabel(type?: number) {
  if (type === 3) return "Studio";
  if (type === 2) return "In Game";
  if (type === 1) return "Online";
  return "Offline";
}

function presenceClass(type?: number) {
  if (type === 3) return "studio";
  if (type === 2) return "ingame";
  if (type === 1) return "online";
  return "offline";
}

function formatAge(seconds: number) {
  if (seconds < 5) return "Updated just now";
  if (seconds < 60) return `Updated ${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `Updated ${minutes}m ago`;
}

export default function Dashboard() {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [games, setGames] = useState<{ main: GameStat | null; e2: GameStat | null }>({ main: null, e2: null });
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [updatedAt, setUpdatedAt] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError("");
    try {
      const [usersRes, mainRes, e2Res] = await Promise.all([
        fetch("/api/roblox/users", { cache: "no-store" }),
        fetch(`/api/roblox/game?placeId=${MAIN_PLACE_ID}`, { cache: "no-store" }),
        fetch(`/api/roblox/game?placeId=${E2_PLACE_ID}`, { cache: "no-store" }),
      ]);

      if (!usersRes.ok || !mainRes.ok || !e2Res.ok) {
        throw new Error("One or more Roblox services did not respond.");
      }

      const [userData, main, e2] = await Promise.all([
        usersRes.json(),
        mainRes.json(),
        e2Res.json(),
      ]);

      setUsers(userData.users ?? []);
      setGames({ main, e2 });
      setUpdatedAt(Date.now());
    } catch (err) {
      console.error(err);
      setError("Could not refresh Roblox data. The previous data is still shown.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = window.setInterval(refresh, 30000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  const [age, setAge] = useState(0);
  useEffect(() => {
    const interval = window.setInterval(() => setAge(Math.floor((Date.now() - updatedAt) / 1000)), 1000);
    return () => window.clearInterval(interval);
  }, [updatedAt]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const userRole = user.name.toLowerCase() === OWNER_USERNAME.toLowerCase() ? "Owner" : "Management";
      const userStatus = presenceLabel(user.presenceType);
      const roleMatch = role === "All" || role === userRole;
      const statusMatch = status === "All" || status === userStatus;
      return roleMatch && statusMatch;
    });
  }, [users, role, status]);

  const owner = filteredUsers.filter((u) => u.name.toLowerCase() === OWNER_USERNAME.toLowerCase());
  const management = filteredUsers.filter((u) => u.name.toLowerCase() !== OWNER_USERNAME.toLowerCase());
  const online = users.filter((u) => (u.presenceType ?? 0) > 0).length;
  const studio = users.filter((u) => u.presenceType === 3).length;

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <div className="eyebrow"><span className="live-dot" /> EUROTUNNEL MANAGEMENT</div>
          <h1>Operations Dashboard</h1>
          <p>Live Roblox activity and team presence in one place.</p>
        </div>
        <button className="refresh-button" onClick={refresh} disabled={refreshing}>
          <RefreshCw size={16} className={refreshing ? "spin" : ""} />
          {refreshing ? "Refreshing" : "Refresh"}
        </button>
      </header>

      <section className="metrics">
        <GameCard title="Eurotunnel Main Game" tag="ACTIVE" tagClass="green" game={games.main} icon={<Server size={18} />} />
        <GameCard title="Eurotunnel E2" tag="TESTING" tagClass="blue" game={games.e2} icon={<Activity size={18} />} />
      </section>

      <div className="status-line">
        <span><Clock3 size={14} /> {formatAge(age)}</span>
        <span className="separator">•</span>
        <span className="online-text"><CircleDot size={13} /> {online} online</span>
        <span className="studio-text">{studio} in studio</span>
      </div>

      {error && <div className="notice"><ShieldCheck size={16} /> {error}</div>}

      <section className="filters">
        <Filter label="Rank" value={role} options={ROLE_OPTIONS} onChange={setRole} />
        <Filter label="Status" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
      </section>

      <TeamSection title="Owner" count={owner.length} users={owner} empty={loading && owner.length === 0} />
      <TeamSection title="Management" count={management.length} users={management} empty={loading && management.length === 0} />
    </main>
  );
}

function GameCard({ title, tag, tagClass, game, icon }: { title: string; tag: string; tagClass: string; game: GameStat | null; icon: React.ReactNode }) {
  return (
    <article className="game-card">
      <div className="game-card-top">
        <div className="game-title">{icon}<span>{title}</span></div>
        <span className={`tag ${tagClass}`}>{tag}</span>
      </div>
      <div className="player-count">{game ? game.playing.toLocaleString() : "—"}</div>
      <div className="player-label">players in-game</div>
      <div className="game-footer">{game ? `${game.visits.toLocaleString()} total visits` : "Waiting for Roblox data"}</div>
    </article>
  );
}

function Filter({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="filter">
      <span>{label}</span>
      <div className="select-wrap">
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
        <ChevronDown size={15} />
      </div>
    </label>
  );
}

function TeamSection({ title, count, users, empty }: { title: string; count: number; users: TeamUser[]; empty: boolean }) {
  return (
    <section className="team-section">
      <div className="section-heading">
        <div><h2>{title}</h2><span>{count}</span></div>
      </div>
      <div className="team-grid">
        {empty ? (
          Array.from({ length: title === "Management" ? 2 : 1 }).map((_, i) => <div className="skeleton" key={i} />)
        ) : users.length ? (
          users.map((user) => <UserCard user={user} key={user.id} owner={title === "Owner"} />)
        ) : (
          <div className="empty">No members match the current filters.</div>
        )}
      </div>
    </section>
  );
}

function UserCard({ user, owner }: { user: TeamUser; owner: boolean }) {
  const status = presenceLabel(user.presenceType);
  return (
    <article className={`user-card ${owner ? "owner-card" : ""}`}>
      <div className="avatar-wrap">
        <img src={user.avatar} alt={`${user.displayName} avatar`} />
        <span className={`presence ${presenceClass(user.presenceType)}`} />
      </div>
      <div className="user-copy">
        <strong>{user.displayName || user.name}</strong>
        <span>@{user.name}</span>
        <small className={owner ? "owner-role" : ""}>{owner ? "Group Owner" : "Management Team"} · {status}</small>
      </div>
    </article>
  );
}