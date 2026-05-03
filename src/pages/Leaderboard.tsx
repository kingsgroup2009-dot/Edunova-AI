import { useMemo } from "react";
import Layout from "../components/Layout";

type LeaderboardItem = {
  name: string;
  coins: number;
  score?: number;
  accuracy?: number;
  completedAt?: string;
};

const Leaderboard = () => {
  const data = useMemo(() => {
    const parsed = JSON.parse(localStorage.getItem("leaderboard") ?? "[]") as LeaderboardItem[];
    return parsed.sort((a, b) => b.coins - a.coins);
  }, []);

  return (
    <Layout>
      <div className="page-header">
        <h1>Leaderboard</h1>
        <p>Top quiz performers ranked by total coins.</p>
      </div>
      <section className="premium-card">
        {data.length === 0 ? (
          <p className="card-label">No scores yet. Complete a quiz to get ranked.</p>
        ) : (
          data.map((item, i) => (
            <div className="leaderboard-row" key={`${item.name}-${i}`}>
              <span>#{i + 1}</span>
              <span>{item.name}</span>
              <span>{item.coins} coins</span>
            </div>
          ))
        )}
      </section>
    </Layout>
  );
};

export default Leaderboard;