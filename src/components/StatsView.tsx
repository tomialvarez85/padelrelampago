import { useState, useEffect } from 'react';
import { TournamentService } from '../services/tournamentService';
import type { TeamStats } from '../types';
import { Trophy } from 'lucide-react';

interface StatsViewProps {
  tournamentId: string;
}

export default function StatsView({ tournamentId }: StatsViewProps) {
  const [overallStats, setOverallStats] = useState<TeamStats[]>([]);
  const [groupStats, setGroupStats] = useState<{ [groupId: string]: TeamStats[] }>({});

  useEffect(() => {
    const tournamentStats = TournamentService.getTeamStats(tournamentId);
    const groupsStats = TournamentService.getGroupStats(tournamentId);
    setOverallStats(tournamentStats);
    setGroupStats(groupsStats);
  }, [tournamentId]);

  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="gold" />;
      case 1: return <Trophy className="silver" />;
      case 2: return <Trophy className="bronze" />;
      default: return null;
    }
  };



  const renderStatsTable = (stats: TeamStats[], title: string) => (
    <div className="stats-section">
      <h3>{title}</h3>
      <div className="stats-table">
                 <div className="stats-header">
           <span className="position-header">Pos</span>
                       <span className="team-header">Pareja</span>
           <span className="stats-header-cell">G</span>
           <span className="stats-header-cell">P</span>
           <span className="stats-header-cell">Total</span>
           <span className="stats-header-cell">GF</span>
           <span className="stats-header-cell">GC</span>
           <span className="stats-header-cell">DIF</span>
         </div>
        
        {stats.map((stat, index) => (
          <div key={stat.teamId} className="stats-row">
            <div className="position-cell">
              {getPositionIcon(index)}
              <span className="position-number">{index + 1}</span>
            </div>
            
                         <div className="team-cell">
               <span className="team-name">{stat.teamName}</span>
             </div>
            
                         <div className="stats-cell wins">{stat.wins}</div>
             <div className="stats-cell losses">{stat.losses}</div>
             <div className="stats-cell total">{stat.totalMatches}</div>
             <div className="stats-cell games-for">{stat.gamesFor}</div>
             <div className="stats-cell games-against">{stat.gamesAgainst}</div>
             <div className={`stats-cell games-difference ${stat.gamesDifference >= 0 ? 'positive' : 'negative'}`}>
               {stat.gamesDifference >= 0 ? `+${stat.gamesDifference}` : stat.gamesDifference}
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="stats-view">
              <h2>Estadisticas de Parejas</h2>
      
      {overallStats.length === 0 ? (
        <div className="no-stats">
                  <p>No hay estadisticas disponibles aun.</p>
        <p>Los datos apareceran cuando se jueguen los primeros partidos.</p>
        </div>
      ) : (
        <>
          <div className="stats-note">
            <p><small>💡 Las estadísticas incluyen todos los partidos jugados, incluyendo partidos extra.</small></p>
          </div>
          <div className="stats-container">
                  {/* Estadisticas por Grupo */}
        <div className="group-stats-section">
          <h3>Estadisticas por Grupo</h3>
            {Object.entries(groupStats).map(([groupId, stats]) => {
              const groupName = stats.length > 0 ? 
                (stats[0]?.teamName.includes('Grupo') ? 
                  stats[0]?.teamName.split(' ')[0] + ' ' + stats[0]?.teamName.split(' ')[1] : 
                  'Grupo Unico') : 
                'Grupo';
              return (
                <div key={groupId} className="group-stats">
                  {renderStatsTable(stats, groupName)}
                </div>
              );
            })}
          </div>

                  {/* Estadisticas Generales */}
        <div className="overall-stats-section">
          {renderStatsTable(overallStats, 'Estadisticas Generales')}
          </div>

          <div className="stats-summary">
            <div className="summary-card">
              <h4>Resumen</h4>
              <div className="summary-stats">
                <div className="summary-stat">
                  <span className="stat-label">Total de parejas:</span>
                  <span className="stat-value">{overallStats.length}</span>
                </div>
                
                <div className="summary-stat">
                  <span className="stat-label">Promedio de victorias:</span>
                  <span className="stat-value">
                    {(overallStats.reduce((sum, stat) => sum + stat.wins, 0) / overallStats.length).toFixed(1)}
                  </span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">Total de games jugados:</span>
                  <span className="stat-value">
                    {overallStats.reduce((sum, stat) => sum + stat.gamesFor, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
} 