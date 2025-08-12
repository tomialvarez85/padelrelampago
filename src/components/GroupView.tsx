import type { Group } from '../types';
import MatchCard from './MatchCard';

interface GroupViewProps {
  groups: Group[];
  onMatchResult: (matchId: string, team1Score: number, team2Score: number) => void;
}

export default function GroupView({ groups, onMatchResult }: GroupViewProps) {
  const calculateGroupStats = (group: Group) => {
    const stats: { [teamId: string]: { wins: number; losses: number; teamName: string } } = {};
    
    // Inicializar estadísticas
    group.teams.forEach(team => {
      stats[team.id] = { wins: 0, losses: 0, teamName: team.name };
    });

    // Calcular estadísticas
    group.matches.forEach(match => {
      if (match.isCompleted && match.winner) {
        if (match.winner.id === match.team1.id) {
          stats[match.team1.id].wins++;
          stats[match.team2.id].losses++;
        } else {
          stats[match.team2.id].wins++;
          stats[match.team1.id].losses++;
        }
      }
    });

    return Object.values(stats).sort((a, b) => b.wins - a.wins);
  };

  const getQualificationInfo = (group: Group) => {
    if (group.teams.length === 4 && group.name === 'Grupo Único') {
      return "Todos los equipos clasifican a semifinales";
    } else if (group.teams.length === 5) {
      return "Los 4 primeros clasifican a semifinales";
    } else if (group.teams.length === 3 && group.name.includes('Grupo')) {
      return "Los 4 mejores de ambos grupos clasifican a cuartos de final";
    } else if (group.teams.length === 4 && group.name.includes('Grupo')) {
      return "Los 2 primeros de cada grupo clasifican a cuartos de final";
    }
    return null;
  };

  return (
    <div className="group-view">
      <h2>Fase de Grupos</h2>
      
      <div className="groups-grid">
        {groups.map((group) => {
          const groupStats = calculateGroupStats(group);
          const completedMatches = group.matches.filter(match => match.isCompleted).length;
          const totalMatches = group.matches.length;
          const qualificationInfo = getQualificationInfo(group);
          
          return (
            <div key={group.id} className="group-card">
              <div className="group-header">
                <h3>{group.name}</h3>
                <span className="group-progress">
                  {completedMatches}/{totalMatches} partidos
                </span>
              </div>

              {qualificationInfo && (
                <div className="qualification-info">
                  <p>{qualificationInfo}</p>
                </div>
              )}

              <div className="group-standings">
                <h4>Posiciones</h4>
                <div className="standings-table">
                  <div className="standings-header">
                    <span>Pos</span>
                    <span>Equipo</span>
                    <span>G</span>
                    <span>P</span>
                  </div>
                  {groupStats.map((stat, index) => (
                    <div key={index} className={`standings-row ${group.teams.length === 5 && index >= 4 ? 'eliminated' : ''}`}>
                      <span className="position">{index + 1}</span>
                      <span className="team-name">{stat.teamName}</span>
                      <span className="wins">{stat.wins}</span>
                      <span className="losses">{stat.losses}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="group-matches">
                <h4>Partidos</h4>
                <div className="matches-list">
                  {group.matches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onResultSubmit={onMatchResult}
                      showGroup={false}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 