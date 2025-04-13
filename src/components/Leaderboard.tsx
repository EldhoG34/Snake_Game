import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import './Leaderboard.css';

interface Score {
  id: number;
  player_name: string;
  score: number;
  created_at: string;
}

const Leaderboard: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScores();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('scores')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scores'
        },
        () => {
          fetchScores();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchScores = async () => {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw error;
      setScores(data || []);
    } catch (err) {
      setError('Failed to fetch scores');
      console.error('Error fetching scores:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitScore = async (playerName: string, score: number) => {
    try {
      const { error } = await supabase
        .from('scores')
        .insert([{ player_name: playerName, score }]);

      if (error) throw error;
      fetchScores();
    } catch (err) {
      setError('Failed to submit score');
      console.error('Error submitting score:', err);
    }
  };

  if (loading) return (
    <div className="leaderboard loading">
      <div className="loader"></div>
      <p>Loading scores...</p>
    </div>
  );

  if (error) return (
    <div className="leaderboard error">
      <p>Error: {error}</p>
      <button onClick={fetchScores}>Try Again</button>
    </div>
  );

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>🏆 Top Scores</h2>
        <button onClick={fetchScores} className="refresh-button">
          🔄 Refresh
        </button>
      </div>
      <div className="leaderboard-table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={score.id} className={index < 3 ? `rank-${index + 1}` : ''}>
                <td>
                  {index < 3 ? (
                    <span className="rank-emoji">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                  ) : (
                    `#${index + 1}`
                  )}
                </td>
                <td>{score.player_name}</td>
                <td className="score-value">{score.score}</td>
                <td>{new Date(score.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {scores.length === 0 && (
              <tr>
                <td colSpan={4} className="no-scores">
                  No scores yet. Be the first to play!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard; 