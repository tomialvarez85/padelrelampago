import { useState, useEffect } from 'react';
import { TournamentService } from '../services/tournamentService';
import type { TeamStats } from '../types';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsViewProps {
  tournamentId: string;
}

export default function StatsView({ tournamentId }: StatsViewProps) {
  const [stats, setStats] = useState<TeamStats[]>([]);

  useEffect(() => {
    const tournamentStats = TournamentService.getTeamStats(tournamentId);
    setStats(tournamentStats);
  }, [tournamentId]);

  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="gold" />;
      case 1: return <Trophy className="silver" />;
      case 2: return <Trophy className="bronze" />;
      default: return null;
    }
  };

  const getTrendIcon = (stat: TeamStats) => {
    if (stat.winPercentage >= 75) {
      return <TrendingUp className="trend-up" />;
    } else if (stat.winPercentage <= 25) {
      return <TrendingDown className="trend-down" />;
    }
    return null;
  };

  return (
    <div className="stats-view">
      <h2>Estadísticas de Equipos</h2>
      
      {stats.length === 0 ? (
        <div className="no-stats">
          <p>No hay estadísticas disponibles aún.</p>
          <p>Los datos aparecerán cuando se jueguen los primeros partidos.</p>
        </div>
      ) : (
        <div className="stats-container">
          <div className="stats-table">
            <div className="stats-header">
              <span className="position-header">Pos</span>
              <span className="team-header">Equipo</span>
              <span className="stats-header-cell">G</span>
              <span className="stats-header-cell">P</span>
              <span className="stats-header-cell">Total</span>
              <span className="stats-header-cell">%</span>
            </div>
            
            {stats.map((stat, index) => (
              <div key={stat.teamId} className="stats-row">
                <div className="position-cell">
                  {getPositionIcon(index)}
                  <span className="position-number">{index + 1}</span>
                </div>
                
                <div className="team-cell">
                  <span className="team-name">{stat.teamName}</span>
                  {getTrendIcon(stat)}
                </div>
                
                <div className="stats-cell wins">{stat.wins}</div>
                <div className="stats-cell losses">{stat.losses}</div>
                <div className="stats-cell total">{stat.totalMatches}</div>
                <div className="stats-cell percentage">
                  {stat.winPercentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>

          <div className="stats-summary">
            <div className="summary-card">
              <h4>Resumen</h4>
              <div className="summary-stats">
                <div className="summary-stat">
                  <span className="stat-label">Total de equipos:</span>
                  <span className="stat-value">{stats.length}</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">Mejor porcentaje:</span>
                  <span className="stat-value">{stats[0]?.winPercentage.toFixed(1)}%</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">Promedio de victorias:</span>
                  <span className="stat-value">
                    {(stats.reduce((sum, stat) => sum + stat.wins, 0) / stats.length).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 