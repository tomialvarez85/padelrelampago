import type { Group } from '../types';
import MatchCard from './MatchCard';

interface GroupViewProps {
  groups: Group[];
  onMatchResult: (matchId: string, team1Score: number, team2Score: number) => void;
  onDeleteMatch?: (matchId: string) => void;
}

export default function GroupView({ groups, onMatchResult, onDeleteMatch }: GroupViewProps) {
  const calculateGroupStats = (group: Group) => {
    const stats: { [teamId: string]: { 
      wins: number; 
      losses: number; 
      teamName: string;
      gamesFor: number;
      gamesAgainst: number;
      gamesDifference: number;
    } } = {};
    
    // Inicializar estadisticas
    group.teams.forEach(team => {
      stats[team.id] = { 
        wins: 0, 
        losses: 0, 
        teamName: team.name,
        gamesFor: 0,
        gamesAgainst: 0,
        gamesDifference: 0
      };
    });

    // Calcular estadisticas
    group.matches.forEach(match => {
      if (match.isCompleted && match.winner && match.team1Score !== undefined && match.team2Score !== undefined) {
        // Sumar games
        stats[match.team1.id].gamesFor += match.team1Score;
        stats[match.team1.id].gamesAgainst += match.team2Score;
        stats[match.team2.id].gamesFor += match.team2Score;
        stats[match.team2.id].gamesAgainst += match.team1Score;
        
        if (match.winner.id === match.team1.id) {
          stats[match.team1.id].wins++;
          stats[match.team2.id].losses++;
        } else {
          stats[match.team2.id].wins++;
          stats[match.team1.id].losses++;
        }
      }
    });

    // Calcular diferencia de games
    Object.values(stats).forEach(stat => {
      stat.gamesDifference = stat.gamesFor - stat.gamesAgainst;
    });

    // Ordenar por criterios de clasificacion: victorias, diferencia de games, games a favor
    return Object.values(stats).sort((a, b) => {
      // 1er criterio: Victorias
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      
      // 2do criterio: Diferencia de games
      if (b.gamesDifference !== a.gamesDifference) {
        return b.gamesDifference - a.gamesDifference;
      }
      
      // 3er criterio: Games a favor
      return b.gamesFor - a.gamesFor;
    });
  };

  const getQualificationInfo = (group: Group) => {
    const totalTeams = group.teams.length + (groups.length > 1 ? groups.find(g => g.id !== group.id)?.teams.length || 0 : 0);
    
    if (totalTeams === 4) {
      return "Los 2 primeros clasifican a final";
    } else if (totalTeams === 5) {
      return "Los 4 primeros clasifican a semifinal";
    } else if (totalTeams === 6) {
      return "Los 4 primeros clasifican a semifinal";
    } else if (totalTeams === 7) {
      if (group.name === 'Grupo A') {
        return "El 1er clasifica directo a semifinal, 2do, 3ro y 4to van a cuartos";
      } else {
        return "Todos clasifican a cuartos de final";
      }
    } else if (totalTeams === 8) {
      return "Todos clasifican a cuartos de final";
    } else if (totalTeams === 9) {
      if (group.name === 'Grupo A') {
        return "Todos clasifican a cuartos de final";
      } else {
        return "Los 4 primeros clasifican a cuartos de final";
      }
    } else if (totalTeams === 10) {
      return "Los 4 primeros clasifican a cuartos de final";
    } else if (totalTeams === 11) {
      return "Los 4 primeros clasifican a semifinal";
    } else if (totalTeams === 12) {
      return "Los 2 primeros clasifican a cuartos de final + 2 mejores terceros";
    } else if (totalTeams === 13) {
      return "Los 2 primeros clasifican a cuartos de final + 2 mejores terceros";
    } else if (totalTeams === 14) {
      return "Los 2 primeros clasifican a cuartos de final";
    } else if (totalTeams === 15) {
      return "Los 2 primeros clasifican a cuartos de final + 2 mejores terceros";
    } else if (totalTeams === 16) {
      return "Los 2 primeros clasifican a cuartos de final";
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
                     <span>Pareja</span>
                     <span>G</span>
                     <span>P</span>
                     <span>GF</span>
                     <span>GC</span>
                     <span>DIF</span>
                   </div>
                   {groupStats.map((stat, index) => (
                     <div key={index} className={`standings-row ${group.teams.length === 5 && index >= 4 ? 'eliminated' : ''}`}>
                       <span className="position">{index + 1}</span>
                       <span className="team-name">{stat.teamName}</span>
                       <span className="wins">{stat.wins}</span>
                       <span className="losses">{stat.losses}</span>
                       <span className="games-for">{stat.gamesFor}</span>
                       <span className="games-against">{stat.gamesAgainst}</span>
                       <span className={`games-difference ${stat.gamesDifference >= 0 ? 'positive' : 'negative'}`}>
                         {stat.gamesDifference >= 0 ? `+${stat.gamesDifference}` : stat.gamesDifference}
                       </span>
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
                      onDelete={onDeleteMatch}
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