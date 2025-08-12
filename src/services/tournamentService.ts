import type { Tournament, Team, Match, Group, TeamStats } from '../types';

const STORAGE_KEY = 'padel_tournaments';

export class TournamentService {
  private static getStoredTournaments(): Tournament[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private static saveTournaments(tournaments: Tournament[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tournaments));
  }

  static createTournament(teams: Team[]): Tournament {
    const tournament: Tournament = {
      id: Date.now().toString(),
      name: `Torneo ${new Date().toLocaleDateString()}`,
      teams,
      groups: [],
      quarterfinals: [],
      semifinals: [],
      final: null,
      isStarted: false,
      isCompleted: false,
      createdAt: new Date(),
    };

    const tournaments = this.getStoredTournaments();
    tournaments.push(tournament);
    this.saveTournaments(tournaments);

    return tournament;
  }

  static getTournaments(): Tournament[] {
    return this.getStoredTournaments();
  }

  static getTournament(id: string): Tournament | null {
    const tournaments = this.getStoredTournaments();
    return tournaments.find(t => t.id === id) || null;
  }

  static startTournament(tournamentId: string): Tournament {
    const tournaments = this.getStoredTournaments();
    const tournamentIndex = tournaments.findIndex(t => t.id === tournamentId);
    
    if (tournamentIndex === -1) {
      throw new Error('Tournament not found');
    }

    const tournament = tournaments[tournamentIndex];
    const shuffledTeams = [...tournament.teams].sort(() => Math.random() - 0.5);
    
    // Crear grupos con mínimo 3 equipos por grupo
    const groups: Group[] = [];
    const totalTeams = shuffledTeams.length;
    
    // Caso especial: 4 equipos - un solo grupo, todos clasifican a semifinales
    if (totalTeams === 4) {
      const group: Group = {
        id: 'group-1',
        name: 'Grupo Único',
        teams: shuffledTeams,
        matches: this.generateGroupMatches(shuffledTeams, 'group-1'),
      };
      groups.push(group);
    } else if (totalTeams === 5) {
      // Caso especial: 5 equipos - un solo grupo, solo los 4 mejores clasifican
      const group: Group = {
        id: 'group-1',
        name: 'Grupo Único',
        teams: shuffledTeams,
        matches: this.generateGroupMatches(shuffledTeams, 'group-1'),
      };
      groups.push(group);
    } else if (totalTeams === 6) {
      // Caso especial: 6 equipos - 2 grupos de 3 equipos con partidos interzonales
      const group1Teams = shuffledTeams.slice(0, 3);
      const group2Teams = shuffledTeams.slice(3, 6);
      
      // Generar partidos dentro de cada grupo
      const group1Matches = this.generateGroupMatches(group1Teams, 'group-1');
      const group2Matches = this.generateGroupMatches(group2Teams, 'group-2');
      
      // Generar partidos interzonales (cada equipo del grupo 1 juega contra un equipo del grupo 2)
      const interzonalMatches = this.generateInterzonalMatches(group1Teams, group2Teams);
      
      const group1: Group = {
        id: 'group-1',
        name: 'Grupo A',
        teams: group1Teams,
        matches: [...group1Matches, ...interzonalMatches.filter(m => group1Teams.some(team => team.id === m.team1.id))],
      };
      
      const group2: Group = {
        id: 'group-2',
        name: 'Grupo B',
        teams: group2Teams,
        matches: [...group2Matches, ...interzonalMatches.filter(m => group2Teams.some(team => team.id === m.team2.id))],
      };
      
      groups.push(group1, group2);
    } else if (totalTeams === 7) {
      // Caso especial: 7 equipos - 1 grupo de 3 equipos y 1 grupo de 4 equipos
      const group1Teams = shuffledTeams.slice(0, 3);
      const group2Teams = shuffledTeams.slice(3, 7);
      
      // Generar partidos dentro de cada grupo
      const group1Matches = this.generateGroupMatches(group1Teams, 'group-1');
      const group2Matches = this.generateGroupMatches(group2Teams, 'group-2');
      
      const group1: Group = {
        id: 'group-1',
        name: 'Grupo A',
        teams: group1Teams,
        matches: group1Matches,
      };
      
      const group2: Group = {
        id: 'group-2',
        name: 'Grupo B',
        teams: group2Teams,
        matches: group2Matches,
      };
      
      groups.push(group1, group2);
    } else if (totalTeams === 8) {
      // Caso especial: 8 equipos - 2 grupos de 4 equipos cada uno
      const group1Teams = shuffledTeams.slice(0, 4);
      const group2Teams = shuffledTeams.slice(4, 8);
      
      // Generar partidos dentro de cada grupo
      const group1Matches = this.generateGroupMatches(group1Teams, 'group-1');
      const group2Matches = this.generateGroupMatches(group2Teams, 'group-2');
      
      const group1: Group = {
        id: 'group-1',
        name: 'Grupo A',
        teams: group1Teams,
        matches: group1Matches,
      };
      
      const group2: Group = {
        id: 'group-2',
        name: 'Grupo B',
        teams: group2Teams,
        matches: group2Matches,
      };
      
      groups.push(group1, group2);
    } else {
      // Calcular el número óptimo de grupos y equipos por grupo
      let numGroups: number;
      let teamsPerGroup: number;
      
      if (totalTeams <= 8) {
        // Para 8 equipos o menos: 2 grupos de 3-4 equipos
        numGroups = 2;
        teamsPerGroup = Math.ceil(totalTeams / numGroups);
      } else if (totalTeams <= 12) {
        // Para 9-12 equipos: 3 grupos de 3-4 equipos
        numGroups = 3;
        teamsPerGroup = Math.ceil(totalTeams / numGroups);
      } else {
        // Para más de 12 equipos: 4 grupos de 3-4 equipos
        numGroups = 4;
        teamsPerGroup = Math.ceil(totalTeams / numGroups);
      }
      
      // Asegurar que no haya grupos con menos de 3 equipos
      if (teamsPerGroup < 3) {
        teamsPerGroup = 3;
        numGroups = Math.ceil(totalTeams / teamsPerGroup);
      }
      
      // Distribuir equipos en grupos
      for (let i = 0; i < numGroups; i++) {
        const startIndex = i * teamsPerGroup;
        const endIndex = Math.min(startIndex + teamsPerGroup, totalTeams);
        const groupTeams = shuffledTeams.slice(startIndex, endIndex);
        
        if (groupTeams.length >= 3) {
          const group: Group = {
            id: `group-${i + 1}`,
            name: `Grupo ${String.fromCharCode(65 + i)}`,
            teams: groupTeams,
            matches: this.generateGroupMatches(groupTeams, `group-${i + 1}`),
          };
          groups.push(group);
        }
      }
      
      // Si quedan equipos sin asignar, distribuirlos en los grupos existentes
      const assignedTeams = groups.reduce((total, group) => total + group.teams.length, 0);
      const remainingTeams = shuffledTeams.slice(assignedTeams);
      
      for (let i = 0; i < remainingTeams.length; i++) {
        const groupIndex = i % groups.length;
        groups[groupIndex].teams.push(remainingTeams[i]);
        // Regenerar partidos del grupo
        groups[groupIndex].matches = this.generateGroupMatches(groups[groupIndex].teams, groups[groupIndex].id);
      }
    }

    tournament.groups = groups;
    tournament.isStarted = true;
    
    tournaments[tournamentIndex] = tournament;
    this.saveTournaments(tournaments);
    
    return tournament;
  }

  private static generateGroupMatches(teams: Team[], groupId: string): Match[] {
    const matches: Match[] = [];
    
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const match: Match = {
          id: `${groupId}-match-${i}-${j}`,
          team1: teams[i],
          team2: teams[j],
          isCompleted: false,
          round: 'group',
          groupId,
        };
        matches.push(match);
      }
    }
    
    return matches;
  }

  private static generateInterzonalMatches(group1Teams: Team[], group2Teams: Team[]): Match[] {
    const matches: Match[] = [];
    
    // Cada equipo del grupo 1 juega contra un equipo diferente del grupo 2
    for (let i = 0; i < group1Teams.length; i++) {
      const match: Match = {
        id: `interzonal-${group1Teams[i].id}-${group2Teams[i].id}`,
        team1: group1Teams[i],
        team2: group2Teams[i],
        isCompleted: false,
        round: 'interzonal',
      };
      matches.push(match);
    }
    
    return matches;
  }

  static updateMatchResult(
    tournamentId: string, 
    matchId: string, 
    team1Score: number, 
    team2Score: number
  ): Tournament {
    const tournaments = this.getStoredTournaments();
    const tournamentIndex = tournaments.findIndex(t => t.id === tournamentId);
    
    if (tournamentIndex === -1) {
      throw new Error('Tournament not found');
    }

    const tournament = tournaments[tournamentIndex];
    
    // Buscar el partido en grupos
    for (const group of tournament.groups) {
      const matchIndex = group.matches.findIndex(m => m.id === matchId);
      if (matchIndex !== -1) {
        group.matches[matchIndex].team1Score = team1Score;
        group.matches[matchIndex].team2Score = team2Score;
        group.matches[matchIndex].winner = team1Score > team2Score 
          ? group.matches[matchIndex].team1 
          : group.matches[matchIndex].team2;
        group.matches[matchIndex].isCompleted = true;
        break;
      }
    }

    // Buscar en cuartos de final
    const quarterfinalIndex = tournament.quarterfinals.findIndex(m => m.id === matchId);
    if (quarterfinalIndex !== -1) {
      tournament.quarterfinals[quarterfinalIndex].team1Score = team1Score;
      tournament.quarterfinals[quarterfinalIndex].team2Score = team2Score;
      tournament.quarterfinals[quarterfinalIndex].winner = team1Score > team2Score 
        ? tournament.quarterfinals[quarterfinalIndex].team1 
        : tournament.quarterfinals[quarterfinalIndex].team2;
      tournament.quarterfinals[quarterfinalIndex].isCompleted = true;
    }

    // Buscar en semifinales
    const semifinalIndex = tournament.semifinals.findIndex(m => m.id === matchId);
    if (semifinalIndex !== -1) {
      tournament.semifinals[semifinalIndex].team1Score = team1Score;
      tournament.semifinals[semifinalIndex].team2Score = team2Score;
      tournament.semifinals[semifinalIndex].winner = team1Score > team2Score 
        ? tournament.semifinals[semifinalIndex].team1 
        : tournament.semifinals[semifinalIndex].team2;
      tournament.semifinals[semifinalIndex].isCompleted = true;
    }

    // Buscar en final
    if (tournament.final && tournament.final.id === matchId) {
      tournament.final.team1Score = team1Score;
      tournament.final.team2Score = team2Score;
      tournament.final.winner = team1Score > team2Score 
        ? tournament.final.team1 
        : tournament.final.team2;
      tournament.final.isCompleted = true;
      tournament.isCompleted = true;
    }

    // Verificar si se pueden generar los cuartos de final
    if (this.canGenerateQuarterfinals(tournament)) {
      tournament.quarterfinals = this.generateQuarterfinals(tournament);
    }

    // Verificar si se pueden generar las semifinales
    if (this.canGenerateSemifinals(tournament)) {
      tournament.semifinals = this.generateSemifinals(tournament);
    }

    // Verificar si se puede generar la final
    if (this.canGenerateFinal(tournament)) {
      tournament.final = this.generateFinal(tournament);
    }

    tournaments[tournamentIndex] = tournament;
    this.saveTournaments(tournaments);
    
    return tournament;
  }

  private static canGenerateQuarterfinals(tournament: Tournament): boolean {
    if (tournament.quarterfinals.length > 0) return false;
    
    // Caso especial: 6, 7 u 8 equipos van directo a cuartos de final
    if (tournament.teams.length === 6 || tournament.teams.length === 7 || tournament.teams.length === 8) {
      return tournament.groups.every(group => 
        group.matches.every(match => match.isCompleted)
      );
    }
    
    return tournament.groups.every(group => 
      group.matches.every(match => match.isCompleted)
    );
  }

  private static canGenerateSemifinals(tournament: Tournament): boolean {
    if (tournament.semifinals.length > 0) return false;
    
    // Caso especial: 4 o 5 equipos van directo a semifinales
    if (tournament.teams.length === 4 || tournament.teams.length === 5) {
      return tournament.groups.every(group => 
        group.matches.every(match => match.isCompleted)
      );
    }
    
    return tournament.quarterfinals.length > 0 && 
           tournament.quarterfinals.every(match => match.isCompleted);
  }

  private static canGenerateFinal(tournament: Tournament): boolean {
    if (tournament.final) return false;
    
    return tournament.semifinals.length > 0 && 
           tournament.semifinals.every(match => match.isCompleted);
  }

  private static generateQuarterfinals(tournament: Tournament): Match[] {
    let quarterfinalists: Team[];
    
    // Caso especial: 6, 7 u 8 equipos van directo a cuartos de final
    if (tournament.teams.length === 6 || tournament.teams.length === 7 || tournament.teams.length === 8) {
      if (tournament.teams.length === 8) {
        // 8 equipos: los 2 mejores de cada grupo clasifican
        quarterfinalists = [];
        for (const group of tournament.groups) {
          const groupStats = this.calculateGroupStats(group);
          const sortedTeams = groupStats.sort((a, b) => b.wins - a.wins);
          quarterfinalists.push(...sortedTeams.slice(0, 2).map(stat => 
            group.teams.find(team => team.id === stat.teamId)!
          ));
        }
      } else {
        // 6 o 7 equipos: los 4 mejores de ambos grupos clasifican
        const allTeams = tournament.groups.flatMap(group => group.teams);
        const allStats = this.calculateOverallStats(tournament);
        const sortedTeams = allStats.sort((a, b) => b.wins - a.wins);
        quarterfinalists = sortedTeams.slice(0, 4).map(stat => 
          allTeams.find(team => team.id === stat.teamId)!
        );
      }
    } else {
      // Obtener los 2 mejores equipos de cada grupo
      quarterfinalists = [];
      for (const group of tournament.groups) {
        const groupStats = this.calculateGroupStats(group);
        const sortedTeams = groupStats.sort((a, b) => b.wins - a.wins);
        quarterfinalists.push(...sortedTeams.slice(0, 2).map(stat => 
          group.teams.find(team => team.id === stat.teamId)!
        ));
      }
    }

    const matches: Match[] = [];
    for (let i = 0; i < quarterfinalists.length; i += 2) {
      if (i + 1 < quarterfinalists.length) {
        const match: Match = {
          id: `quarterfinal-${i / 2 + 1}`,
          team1: quarterfinalists[i],
          team2: quarterfinalists[i + 1],
          isCompleted: false,
          round: 'quarterfinal',
        };
        matches.push(match);
      }
    }

    return matches;
  }

  private static generateSemifinals(tournament: Tournament): Match[] {
    let semifinalists: Team[];
    
    // Caso especial: 4 o 5 equipos van directo a semifinales
    if (tournament.teams.length === 4 || tournament.teams.length === 5) {
      // Todos los equipos (4) o los 4 mejores (5) clasifican a semifinales
      const group = tournament.groups[0];
      const groupStats = this.calculateGroupStats(group);
      const sortedTeams = groupStats.sort((a, b) => b.wins - a.wins);
      
      if (tournament.teams.length === 4) {
        // 4 equipos: todos clasifican
        semifinalists = sortedTeams.map(stat => 
          group.teams.find(team => team.id === stat.teamId)!
        );
      } else {
        // 5 equipos: solo los 4 mejores clasifican
        semifinalists = sortedTeams.slice(0, 4).map(stat => 
          group.teams.find(team => team.id === stat.teamId)!
        );
      }
    } else {
      // Caso normal: semifinalistas vienen de cuartos de final
      semifinalists = tournament.quarterfinals
        .filter(match => match.winner)
        .map(match => match.winner!);
    }

    const matches: Match[] = [];
    for (let i = 0; i < semifinalists.length; i += 2) {
      if (i + 1 < semifinalists.length) {
        const match: Match = {
          id: `semifinal-${i / 2 + 1}`,
          team1: semifinalists[i],
          team2: semifinalists[i + 1],
          isCompleted: false,
          round: 'semifinal',
        };
        matches.push(match);
      }
    }

    return matches;
  }

  private static generateFinal(tournament: Tournament): Match {
    const finalists = tournament.semifinals
      .filter(match => match.winner)
      .map(match => match.winner!);

    return {
      id: 'final',
      team1: finalists[0],
      team2: finalists[1],
      isCompleted: false,
      round: 'final',
    };
  }

  private static calculateGroupStats(group: Group): TeamStats[] {
    const stats: { [teamId: string]: TeamStats } = {};
    
    // Inicializar estadísticas
    for (const team of group.teams) {
      stats[team.id] = {
        teamId: team.id,
        teamName: team.name,
        wins: 0,
        losses: 0,
        totalMatches: 0,
        winPercentage: 0,
      };
    }

    // Calcular estadísticas
    for (const match of group.matches) {
      if (match.isCompleted && match.winner) {
        stats[match.team1.id].totalMatches++;
        stats[match.team2.id].totalMatches++;
        
        if (match.winner.id === match.team1.id) {
          stats[match.team1.id].wins++;
          stats[match.team2.id].losses++;
        } else {
          stats[match.team2.id].wins++;
          stats[match.team1.id].losses++;
        }
      }
    }

    // Calcular porcentaje de victorias
    Object.values(stats).forEach(stat => {
      stat.winPercentage = stat.totalMatches > 0 
        ? (stat.wins / stat.totalMatches) * 100 
        : 0;
    });

    return Object.values(stats);
  }

  private static calculateOverallStats(tournament: Tournament): TeamStats[] {
    const stats: { [teamId: string]: TeamStats } = {};
    
    // Inicializar estadísticas para todos los equipos
    for (const team of tournament.teams) {
      stats[team.id] = {
        teamId: team.id,
        teamName: team.name,
        wins: 0,
        losses: 0,
        totalMatches: 0,
        winPercentage: 0,
      };
    }

    // Calcular estadísticas de todos los partidos de todos los grupos
    for (const group of tournament.groups) {
      for (const match of group.matches) {
        if (match.isCompleted && match.winner) {
          stats[match.team1.id].totalMatches++;
          stats[match.team2.id].totalMatches++;
          
          if (match.winner.id === match.team1.id) {
            stats[match.team1.id].wins++;
            stats[match.team2.id].losses++;
          } else {
            stats[match.team2.id].wins++;
            stats[match.team1.id].losses++;
          }
        }
      }
    }

    // Calcular porcentaje de victorias
    Object.values(stats).forEach(stat => {
      stat.winPercentage = stat.totalMatches > 0 
        ? (stat.wins / stat.totalMatches) * 100 
        : 0;
    });

    return Object.values(stats);
  }

  static getTeamStats(tournamentId: string): TeamStats[] {
    const tournament = this.getTournament(tournamentId);
    if (!tournament) return [];

    const stats: { [teamId: string]: TeamStats } = {};
    
    // Inicializar estadísticas
    for (const team of tournament.teams) {
      stats[team.id] = {
        teamId: team.id,
        teamName: team.name,
        wins: 0,
        losses: 0,
        totalMatches: 0,
        winPercentage: 0,
      };
    }

    // Contar partidos de grupos
    for (const group of tournament.groups) {
      for (const match of group.matches) {
        if (match.isCompleted && match.winner) {
          stats[match.team1.id].totalMatches++;
          stats[match.team2.id].totalMatches++;
          
          if (match.winner.id === match.team1.id) {
            stats[match.team1.id].wins++;
            stats[match.team2.id].losses++;
          } else {
            stats[match.team2.id].wins++;
            stats[match.team1.id].losses++;
          }
        }
      }
    }

    // Contar partidos de eliminación
    const eliminationMatches = [
      ...tournament.quarterfinals,
      ...tournament.semifinals,
      ...(tournament.final ? [tournament.final] : []),
    ];

    for (const match of eliminationMatches) {
      if (match.isCompleted && match.winner) {
        stats[match.team1.id].totalMatches++;
        stats[match.team2.id].totalMatches++;
        
        if (match.winner.id === match.team1.id) {
          stats[match.team1.id].wins++;
          stats[match.team2.id].losses++;
        } else {
          stats[match.team2.id].wins++;
          stats[match.team1.id].losses++;
        }
      }
    }

    // Calcular porcentaje de victorias
    Object.values(stats).forEach(stat => {
      stat.winPercentage = stat.totalMatches > 0 
        ? (stat.wins / stat.totalMatches) * 100 
        : 0;
    });

    return Object.values(stats).sort((a, b) => b.winPercentage - a.winPercentage);
  }

  static deleteTournament(tournamentId: string): void {
    const tournaments = this.getStoredTournaments();
    const filteredTournaments = tournaments.filter(t => t.id !== tournamentId);
    this.saveTournaments(filteredTournaments);
  }
} 