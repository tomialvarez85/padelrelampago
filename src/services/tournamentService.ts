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

  static createTournament(teams: Team[], name?: string): Tournament {
    const tournament: Tournament = {
      id: Date.now().toString(),
      name: name || `Torneo ${new Date().toLocaleDateString()}`,
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
    
    const groups: Group[] = [];
    const totalTeams = shuffledTeams.length;
    
    // Implementar las reglas especificas segun la cantidad de parejas
    if (totalTeams === 4) {
      // Torneo de 4 parejas: Un grupo de cuatro parejas y pasan los primeros 2 a final
      const group: Group = {
        id: 'group-1',
        name: 'Grupo Unico',
        teams: shuffledTeams,
        matches: this.generateGroupMatches(shuffledTeams, 'group-1'),
      };
      groups.push(group);
    } else if (totalTeams === 5) {
      // Torneo de 5 parejas: Un grupo de 5 parejas y pasan 4 a semifinal
      const group: Group = {
        id: 'group-1',
        name: 'Grupo Unico',
        teams: shuffledTeams,
        matches: this.generateGroupMatches(shuffledTeams, 'group-1'),
      };
      groups.push(group);
    } else if (totalTeams === 6) {
      // Torneo de 6 parejas: Un grupo de 6 parejas y pasan primeros 4 a semifinal
      const group: Group = {
        id: 'group-1',
        name: 'Grupo Unico',
        teams: shuffledTeams,
        matches: this.generateGroupMatches(shuffledTeams, 'group-1'),
      };
      groups.push(group);
    } else if (totalTeams === 7) {
      // Torneo de 7 parejas: Un grupo de 4 parejas y un grupo de 3 parejas
      const group1Teams = shuffledTeams.slice(0, 4);
      const group2Teams = shuffledTeams.slice(4, 7);
      
      const group1: Group = {
        id: 'group-1',
        name: 'Grupo A',
        teams: group1Teams,
        matches: this.generateGroupMatches(group1Teams, 'group-1'),
      };
      
      const group2: Group = {
        id: 'group-2',
        name: 'Grupo B',
        teams: group2Teams,
        matches: this.generateGroupMatches(group2Teams, 'group-2'),
      };
      
      groups.push(group1, group2);
    } else if (totalTeams === 8) {
      // Torneo de 8 parejas: 2 grupos de 4, pasan todos a 4tos de final
      const group1Teams = shuffledTeams.slice(0, 4);
      const group2Teams = shuffledTeams.slice(4, 8);
      
      const group1: Group = {
        id: 'group-1',
        name: 'Grupo A',
        teams: group1Teams,
        matches: this.generateGroupMatches(group1Teams, 'group-1'),
      };
      
      const group2: Group = {
        id: 'group-2',
        name: 'Grupo B',
        teams: group2Teams,
        matches: this.generateGroupMatches(group2Teams, 'group-2'),
      };
      
      groups.push(group1, group2);
    } else if (totalTeams === 9) {
      // Torneo de 9 parejas: Un grupo de 4 y uno de 5
      const group1Teams = shuffledTeams.slice(0, 4);
      const group2Teams = shuffledTeams.slice(4, 9);
      
      const group1: Group = {
        id: 'group-1',
        name: 'Grupo A',
        teams: group1Teams,
        matches: this.generateGroupMatches(group1Teams, 'group-1'),
      };
      
      const group2: Group = {
        id: 'group-2',
        name: 'Grupo B',
        teams: group2Teams,
        matches: this.generateGroupMatches(group2Teams, 'group-2'),
      };
      
      groups.push(group1, group2);
    } else if (totalTeams === 10) {
      // Torneo de 10 parejas: 2 grupos de 5, pasan los primeros 4 de cada grupo a 4tos de final
      const group1Teams = shuffledTeams.slice(0, 5);
      const group2Teams = shuffledTeams.slice(5, 10);
      
      const group1: Group = {
        id: 'group-1',
        name: 'Grupo A',
        teams: group1Teams,
        matches: this.generateGroupMatches(group1Teams, 'group-1'),
      };
      
      const group2: Group = {
        id: 'group-2',
        name: 'Grupo B',
        teams: group2Teams,
        matches: this.generateGroupMatches(group2Teams, 'group-2'),
      };
      
      groups.push(group1, group2);
    } else if (totalTeams === 11) {
      // Torneo de 11 parejas: Un grupo de 5 y uno de 6, pasan los primeros 4 de cada grupo a semifinal
      const group1Teams = shuffledTeams.slice(0, 5);
      const group2Teams = shuffledTeams.slice(5, 11);
      
      const group1: Group = {
        id: 'group-1',
        name: 'Grupo A',
        teams: group1Teams,
        matches: this.generateGroupMatches(group1Teams, 'group-1'),
      };
      
      const group2: Group = {
        id: 'group-2',
        name: 'Grupo B',
        teams: group2Teams,
        matches: this.generateGroupMatches(group2Teams, 'group-2'),
      };
      
      groups.push(group1, group2);
    } else if (totalTeams === 12) {
      // Torneo de 12 parejas: 3 grupos de 4 parejas, pasan a 4tos de final los 2 primeros de cada grupo y los dos mejores terceros
      const group1Teams = shuffledTeams.slice(0, 4);
      const group2Teams = shuffledTeams.slice(4, 8);
      const group3Teams = shuffledTeams.slice(8, 12);
      
      const group1: Group = {
        id: 'group-1',
        name: 'Grupo A',
        teams: group1Teams,
        matches: this.generateGroupMatches(group1Teams, 'group-1'),
      };
      
      const group2: Group = {
        id: 'group-2',
        name: 'Grupo B',
        teams: group2Teams,
        matches: this.generateGroupMatches(group2Teams, 'group-2'),
      };
      
      const group3: Group = {
        id: 'group-3',
        name: 'Grupo C',
        teams: group3Teams,
        matches: this.generateGroupMatches(group3Teams, 'group-3'),
      };
      
      groups.push(group1, group2, group3);
    } else if (totalTeams === 13) {
      // Torneo 13 parejas: 2 grupos de 4 y uno de 5. Pasan a 4tos los 2 primeros de cada grupo y los dos mejores 3eros
      const group1Teams = shuffledTeams.slice(0, 4);
      const group2Teams = shuffledTeams.slice(4, 8);
      const group3Teams = shuffledTeams.slice(8, 13);
      
      const group1: Group = {
        id: 'group-1',
        name: 'Grupo A',
        teams: group1Teams,
        matches: this.generateGroupMatches(group1Teams, 'group-1'),
      };
      
      const group2: Group = {
        id: 'group-2',
        name: 'Grupo B',
        teams: group2Teams,
        matches: this.generateGroupMatches(group2Teams, 'group-2'),
      };
      
      const group3: Group = {
        id: 'group-3',
        name: 'Grupo C',
        teams: group3Teams,
        matches: this.generateGroupMatches(group3Teams, 'group-3'),
      };
      
      groups.push(group1, group2, group3);
    } else if (totalTeams === 14) {
      // Torneo 14 parejas: 2 grupos de 4 y 2 grupos de 3 (juegan interzonal entre los grupos de 3)
      const group1Teams = shuffledTeams.slice(0, 4);
      const group2Teams = shuffledTeams.slice(4, 8);
      const group3Teams = shuffledTeams.slice(8, 11);
      const group4Teams = shuffledTeams.slice(11, 14);
      
      // Generar partidos interzonales entre grupos de 3
      const interzonalMatches = this.generateInterzonalMatches(group3Teams, group4Teams);
      
      const group1: Group = {
        id: 'group-1',
        name: 'Grupo A',
        teams: group1Teams,
        matches: this.generateGroupMatches(group1Teams, 'group-1'),
      };
      
      const group2: Group = {
        id: 'group-2',
        name: 'Grupo B',
        teams: group2Teams,
        matches: this.generateGroupMatches(group2Teams, 'group-2'),
      };
      
      const group3: Group = {
        id: 'group-3',
        name: 'Grupo C',
        teams: group3Teams,
        matches: [...this.generateGroupMatches(group3Teams, 'group-3'), ...interzonalMatches.filter(m => group3Teams.some(team => team.id === m.team1.id))],
      };
      
      const group4: Group = {
        id: 'group-4',
        name: 'Grupo D',
        teams: group4Teams,
        matches: [...this.generateGroupMatches(group4Teams, 'group-4'), ...interzonalMatches.filter(m => group4Teams.some(team => team.id === m.team2.id))],
      };
      
      groups.push(group1, group2, group3, group4);
    } else if (totalTeams === 15) {
      // Torneo 15 parejas: 3 grupos de 5, pasan a 4tos los 2 primeros de cada grupo y los 2 mejores 3eros
      const group1Teams = shuffledTeams.slice(0, 5);
      const group2Teams = shuffledTeams.slice(5, 10);
      const group3Teams = shuffledTeams.slice(10, 15);
      
      const group1: Group = {
        id: 'group-1',
        name: 'Grupo A',
        teams: group1Teams,
        matches: this.generateGroupMatches(group1Teams, 'group-1'),
      };
      
      const group2: Group = {
        id: 'group-2',
        name: 'Grupo B',
        teams: group2Teams,
        matches: this.generateGroupMatches(group2Teams, 'group-2'),
      };
      
      const group3: Group = {
        id: 'group-3',
        name: 'Grupo C',
        teams: group3Teams,
        matches: this.generateGroupMatches(group3Teams, 'group-3'),
      };
      
      groups.push(group1, group2, group3);
    } else if (totalTeams === 16) {
      // Torneo 16 parejas: 4 grupos de 4, pasan a 4tos los dos primeros de cada grupo
      const group1Teams = shuffledTeams.slice(0, 4);
      const group2Teams = shuffledTeams.slice(4, 8);
      const group3Teams = shuffledTeams.slice(8, 12);
      const group4Teams = shuffledTeams.slice(12, 16);
      
      const group1: Group = {
        id: 'group-1',
        name: 'Grupo A',
        teams: group1Teams,
        matches: this.generateGroupMatches(group1Teams, 'group-1'),
      };
      
      const group2: Group = {
        id: 'group-2',
        name: 'Grupo B',
        teams: group2Teams,
        matches: this.generateGroupMatches(group2Teams, 'group-2'),
      };
      
      const group3: Group = {
        id: 'group-3',
        name: 'Grupo C',
        teams: group3Teams,
        matches: this.generateGroupMatches(group3Teams, 'group-3'),
      };
      
      const group4: Group = {
        id: 'group-4',
        name: 'Grupo D',
        teams: group4Teams,
        matches: this.generateGroupMatches(group4Teams, 'group-4'),
      };
      
      groups.push(group1, group2, group3, group4);
    } else {
      // Para mas de 16 equipos, usar distribucion automatica
      let numGroups: number;
      let teamsPerGroup: number;
      
      if (totalTeams <= 20) {
        numGroups = 4;
        teamsPerGroup = Math.ceil(totalTeams / numGroups);
      } else {
        numGroups = 5;
        teamsPerGroup = Math.ceil(totalTeams / numGroups);
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

  static startTournamentWithManualGroups(tournamentId: string, groups: Group[]): Tournament {
    const tournaments = this.getStoredTournaments();
    const tournamentIndex = tournaments.findIndex(t => t.id === tournamentId);
    
    if (tournamentIndex === -1) {
      throw new Error('Tournament not found');
    }

    const tournament = tournaments[tournamentIndex];
    
    // Verificar que todos los equipos esten asignados
    const assignedTeams = groups.flatMap(group => group.teams);
    const allTeams = tournament.teams;
    
    if (assignedTeams.length !== allTeams.length) {
      throw new Error('Todos los equipos deben estar asignados a un grupo');
    }
    
    // Verificar que no haya equipos duplicados
    const assignedTeamIds = assignedTeams.map(team => team.id);
    const uniqueTeamIds = new Set(assignedTeamIds);
    
    if (assignedTeamIds.length !== uniqueTeamIds.size) {
      throw new Error('No puede haber equipos duplicados en los grupos');
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

    tournaments[tournamentIndex] = tournament;
    this.saveTournaments(tournaments);
    
    return tournament;
  }

  private static canGenerateQuarterfinals(tournament: Tournament): boolean {
    if (tournament.quarterfinals.length > 0) return false;
    
    const totalTeams = tournament.teams.length;
    
    // Los casos de 4, 5, 6 parejas van directo a semifinales, no generan cuartos de final
    if (totalTeams === 4 || totalTeams === 5 || totalTeams === 6) {
      return false;
    }
    
    // Verificar que todos los partidos de grupos esten completados
    return tournament.groups.every(group => 
      group.matches.every(match => match.isCompleted)
    );
  }

  private static canGenerateSemifinals(tournament: Tournament): boolean {
    if (tournament.semifinals.length > 0) return false;
    
    const totalTeams = tournament.teams.length;
    
    // Casos que van directo a semifinales desde grupos
    if (totalTeams === 4 || totalTeams === 5 || totalTeams === 6 || totalTeams === 11) {
      return tournament.groups.every(group => 
        group.matches.every(match => match.isCompleted)
      );
    }
    
    // Casos que van a cuartos de final primero
    return tournament.quarterfinals.length > 0 && 
           tournament.quarterfinals.every(match => match.isCompleted);
  }

  private static canGenerateFinal(tournament: Tournament): boolean {
    if (tournament.final) return false;
    
    const totalTeams = tournament.teams.length;
    
    if (totalTeams === 4) {
      // Torneo de 4 parejas: va directo a final desde grupos
      return tournament.groups.every(group => 
        group.matches.every(match => match.isCompleted)
      );
    }
    
    return tournament.semifinals.length > 0 && 
           tournament.semifinals.every(match => match.isCompleted);
  }

  private static generateQuarterfinals(tournament: Tournament): Match[] {
    const totalTeams = tournament.teams.length;
    const matches: Match[] = [];
    
    // Obtener estadisticas de todos los grupos
    const groupStats: { [groupId: string]: Team[] } = {};
    for (const group of tournament.groups) {
      const stats = this.calculateGroupStats(group, tournament.id);
      const sortedTeams = stats.map(stat => 
        group.teams.find(team => team.id === stat.teamId)!
      );
      groupStats[group.id] = sortedTeams;
    }
    
    const groupIds = Object.keys(groupStats);
    
    // Los casos de 4, 5, 6 parejas van directo a semifinales, no generan cuartos de final
    if (totalTeams === 4 || totalTeams === 5 || totalTeams === 6) {
      return [];
    }
    
    if (totalTeams === 7) {
      // 7 parejas: Grupo A (4 equipos) - 1er pasa a semifinal, 2do, 3ro y 4to van a cuartos
      // Grupo B (3 equipos) - todos van a cuartos
      // Los del mismo grupo NO se enfrentan entre si
      const groupA = groupStats[groupIds[0]];
      const groupB = groupStats[groupIds[1]];
      
      // 2do del grupo A vs 1ro del grupo B
      matches.push({
        id: 'quarterfinal-1',
        team1: groupA[1], // 2do grupo A
        team2: groupB[0], // 1ro grupo B
        isCompleted: false,
        round: 'quarterfinal',
      });
      
      // 3ro del grupo A vs 2do del grupo B
      matches.push({
        id: 'quarterfinal-2',
        team1: groupA[2], // 3ro grupo A
        team2: groupB[1], // 2do grupo B
        isCompleted: false,
        round: 'quarterfinal',
      });
      
      // 4to del grupo A vs 3ro del grupo B
      matches.push({
        id: 'quarterfinal-3',
        team1: groupA[3], // 4to grupo A
        team2: groupB[2], // 3ro grupo B
        isCompleted: false,
        round: 'quarterfinal',
      });
      
    } else if (totalTeams === 8 || totalTeams === 9 || totalTeams === 10 || totalTeams === 11) {
      // 8-11 parejas: 1ro de un grupo vs 4to del otro, 2do vs 3ro del otro grupo
      const group1 = groupStats[groupIds[0]];
      const group2 = groupStats[groupIds[1]];
      
      // 1ro grupo 1 vs 4to grupo 2
      matches.push({
        id: 'quarterfinal-1',
        team1: group1[0], // 1ro grupo 1
        team2: group2[3], // 4to grupo 2
        isCompleted: false,
        round: 'quarterfinal',
      });
      
      // 2do grupo 1 vs 3ro grupo 2
      matches.push({
        id: 'quarterfinal-2',
        team1: group1[1], // 2do grupo 1
        team2: group2[2], // 3ro grupo 2
        isCompleted: false,
        round: 'quarterfinal',
      });
      
      // 1ro grupo 2 vs 4to grupo 1
      matches.push({
        id: 'quarterfinal-3',
        team1: group2[0], // 1ro grupo 2
        team2: group1[3], // 4to grupo 1
        isCompleted: false,
        round: 'quarterfinal',
      });
      
      // 2do grupo 2 vs 3ro grupo 1
      matches.push({
        id: 'quarterfinal-4',
        team1: group2[1], // 2do grupo 2
        team2: group1[2], // 3ro grupo 1
        isCompleted: false,
        round: 'quarterfinal',
      });
      
    } else if (totalTeams === 12 || totalTeams === 13 || totalTeams === 15) {
      // 12, 13, 15 parejas: Dos primeros juegan contra los 2 terceros, 
      // el primero faltante juega contra un segundo y los otros dos segundos juegan entre si
      // Todos los cruces tienen que ser entre parejas de distintos grupos
      
      // Obtener todos los primeros, segundos y terceros
      const firstPlaces: Team[] = [];
      const secondPlaces: Team[] = [];
      const thirdPlaces: Team[] = [];
      
      for (const groupId of groupIds) {
        const group = groupStats[groupId];
        if (group.length >= 1) firstPlaces.push(group[0]);
        if (group.length >= 2) secondPlaces.push(group[1]);
        if (group.length >= 3) thirdPlaces.push(group[2]);
      }
      
      // Ordenar terceros por estadisticas para obtener los mejores
      const thirdPlaceStats: { team: Team; stats: any }[] = [];
      for (const group of tournament.groups) {
        const stats = this.calculateGroupStats(group, tournament.id);
        if (stats.length >= 3) {
          thirdPlaceStats.push({ team: groupStats[group.id][2], stats: stats[2] });
        }
      }
      const bestThirdPlaces = thirdPlaceStats
        .sort((a, b) => b.stats.wins - a.stats.wins)
        .slice(0, 2)
        .map(item => item.team);
      
      // Emparejar: 2 primeros vs 2 mejores terceros
      matches.push({
        id: 'quarterfinal-1',
        team1: firstPlaces[0],
        team2: bestThirdPlaces[0],
        isCompleted: false,
        round: 'quarterfinal',
      });
      
      matches.push({
        id: 'quarterfinal-2',
        team1: firstPlaces[1],
        team2: bestThirdPlaces[1],
        isCompleted: false,
        round: 'quarterfinal',
      });
      
      // El primer faltante vs un segundo
      matches.push({
        id: 'quarterfinal-3',
        team1: firstPlaces[2],
        team2: secondPlaces[0],
        isCompleted: false,
        round: 'quarterfinal',
      });
      
      // Los otros dos segundos juegan entre si
      matches.push({
        id: 'quarterfinal-4',
        team1: secondPlaces[1],
        team2: secondPlaces[2],
        isCompleted: false,
        round: 'quarterfinal',
      });
      
    } else if (totalTeams === 14 || totalTeams === 16) {
      // 14, 16 parejas: Los primeros juegan contra los segundos
      // Siempre los cruces tienen que ser de diferentes grupos
      
      const firstPlaces: Team[] = [];
      const secondPlaces: Team[] = [];
      
      for (const groupId of groupIds) {
        const group = groupStats[groupId];
        if (group.length >= 1) firstPlaces.push(group[0]);
        if (group.length >= 2) secondPlaces.push(group[1]);
      }
      
      // Emparejar primeros vs segundos de diferentes grupos
      for (let i = 0; i < firstPlaces.length; i++) {
        matches.push({
          id: `quarterfinal-${i + 1}`,
          team1: firstPlaces[i],
          team2: secondPlaces[i],
          isCompleted: false,
          round: 'quarterfinal',
        });
      }
    }

    return matches;
  }

  private static generateSemifinals(tournament: Tournament): Match[] {
    const totalTeams = tournament.teams.length;
    const matches: Match[] = [];
    
    if (totalTeams === 4) {
      // Torneo de 4 parejas: pasan los primeros 2 a final (no hay semifinales, van directo a final)
      return [];
      
    } else if (totalTeams === 5 || totalTeams === 6) {
      // 5-6 parejas: van directo a semifinales desde grupos
      // Obtener las parejas clasificadas del grupo unico
      const group = tournament.groups[0];
      const groupStats = this.calculateGroupStats(group, tournament.id);
      const sortedTeams = groupStats.map(stat => 
        group.teams.find(team => team.id === stat.teamId)!
      );
      
      // Para 5 parejas: pasan 4 a semifinal (1ro vs 4to, 2do vs 3ro)
      // Para 6 parejas: pasan 4 a semifinal (1ro vs 4to, 2do vs 3ro)
      const semifinalists = sortedTeams.slice(0, 4);
      
      // Crear semifinales: 1ro vs 4to, 2do vs 3ro
      matches.push({
        id: 'semifinal-1',
        team1: semifinalists[0], // 1ro
        team2: semifinalists[3], // 4to
        isCompleted: false,
        round: 'semifinal',
      });
      
      matches.push({
        id: 'semifinal-2',
        team1: semifinalists[1], // 2do
        team2: semifinalists[2], // 3ro
        isCompleted: false,
        round: 'semifinal',
      });
      
    } else if (totalTeams === 7) {
      // 7 parejas: 1er del grupo A pasa directo a semifinal + ganadores de cuartos
      const groupA = tournament.groups.find(g => g.name === 'Grupo A')!;
      const groupAStats = this.calculateGroupStats(groupA, tournament.id);
      const sortedGroupA = groupAStats.sort((a, b) => b.wins - a.wins);
      const groupAFirst = groupA.teams.find(team => team.id === sortedGroupA[0].teamId)!;
      
      // Los ganadores de cuartos de final
      const quarterfinalWinners = tournament.quarterfinals
        .filter(match => match.winner)
        .map(match => match.winner!);
      
      // Crear semifinales: 1er grupo A vs ganador cuartos, otros dos ganadores entre si
      matches.push({
        id: 'semifinal-1',
        team1: groupAFirst,
        team2: quarterfinalWinners[0],
        isCompleted: false,
        round: 'semifinal',
      });
      
      if (quarterfinalWinners.length >= 2) {
        matches.push({
          id: 'semifinal-2',
          team1: quarterfinalWinners[1],
          team2: quarterfinalWinners[2],
          isCompleted: false,
          round: 'semifinal',
        });
      }
      
    } else if (totalTeams === 11) {
      // 11 parejas: pasan los primeros 4 de cada grupo a semifinal
      const semifinalists: Team[] = [];
      for (const group of tournament.groups) {
        const groupStats = this.calculateGroupStats(group, tournament.id);
        const sortedTeams = groupStats.sort((a, b) => b.wins - a.wins);
        semifinalists.push(...sortedTeams.slice(0, 4).map(stat => 
          group.teams.find(team => team.id === stat.teamId)!
        ));
      }
      
      // Crear semifinales
      for (let i = 0; i < semifinalists.length; i += 2) {
        if (i + 1 < semifinalists.length) {
          matches.push({
            id: `semifinal-${i / 2 + 1}`,
            team1: semifinalists[i],
            team2: semifinalists[i + 1],
            isCompleted: false,
            round: 'semifinal',
          });
        }
      }
      
    } else {
      // Caso normal: semifinalistas vienen de cuartos de final
      const quarterfinalWinners = tournament.quarterfinals
        .filter(match => match.winner)
        .map(match => match.winner!);
      
      for (let i = 0; i < quarterfinalWinners.length; i += 2) {
        if (i + 1 < quarterfinalWinners.length) {
          matches.push({
            id: `semifinal-${i / 2 + 1}`,
            team1: quarterfinalWinners[i],
            team2: quarterfinalWinners[i + 1],
            isCompleted: false,
            round: 'semifinal',
          });
        }
      }
    }

    return matches;
  }

  private static generateFinal(tournament: Tournament): Match {
    let finalists: Team[];
    const totalTeams = tournament.teams.length;
    
    if (totalTeams === 4) {
      // Torneo de 4 parejas: los 2 mejores del grupo van a final
      const group = tournament.groups[0];
      const groupStats = this.calculateGroupStats(group, tournament.id);
      const sortedTeams = groupStats.sort((a, b) => b.wins - a.wins);
      finalists = sortedTeams.slice(0, 2).map(stat => 
        group.teams.find(team => team.id === stat.teamId)!
      );
    } else {
      // Caso normal: finalistas vienen de semifinales
      finalists = tournament.semifinals
        .filter(match => match.winner)
        .map(match => match.winner!);
    }

    return {
      id: 'final',
      team1: finalists[0],
      team2: finalists[1],
      isCompleted: false,
      round: 'final',
    };
  }

  private static calculateGroupStats(group: Group, tournamentId?: string): TeamStats[] {
    const stats: { [teamId: string]: TeamStats } = {};
    
    // Inicializar estadisticas
    for (const team of group.teams) {
      stats[team.id] = {
        teamId: team.id,
        teamName: team.name,
        wins: 0,
        losses: 0,
        totalMatches: 0,
        winPercentage: 0,
        gamesFor: 0,
        gamesAgainst: 0,
        gamesDifference: 0,
      };
    }

    // Obtener el torneo para acceder a todos los partidos extra
    const tournament = tournamentId ? this.getTournament(tournamentId) : null;
    if (!tournament) {
      // Si no se puede obtener el torneo, usar solo los partidos del grupo
      for (const match of group.matches) {
        if (match.isCompleted && match.winner && match.team1Score !== undefined && match.team2Score !== undefined) {
          // Verificar que ambos equipos pertenezcan al grupo
          const team1InGroup = group.teams.some(team => team.id === match.team1.id);
          const team2InGroup = group.teams.some(team => team.id === match.team2.id);
          
          // Solo incluir el partido si ambos equipos pertenecen al grupo
          if (team1InGroup && team2InGroup) {
            stats[match.team1.id].totalMatches++;
            stats[match.team2.id].totalMatches++;
            
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
        }
             }
       
       // Calcular porcentaje de victorias y diferencia de games
       Object.values(stats).forEach(stat => {
         stat.winPercentage = stat.totalMatches > 0 
           ? (stat.wins / stat.totalMatches) * 100 
           : 0;
         stat.gamesDifference = stat.gamesFor - stat.gamesAgainst;
       });

       // Ordenar por criterios de clasificación: victorias, diferencia de games, games a favor
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
     }

    // Obtener todos los partidos del torneo
    const allMatches = this.getAllMatches(tournament.id);
    
    // Filtrar partidos que involucren equipos del grupo (incluyendo partidos extra de fase de grupos)
    const relevantMatches = allMatches.filter(match => {
      if (!match.isCompleted || !match.winner || match.team1Score === undefined || match.team2Score === undefined) {
        return false;
      }
      
      // Verificar que ambos equipos pertenezcan al grupo
      const team1InGroup = group.teams.some(team => team.id === match.team1.id);
      const team2InGroup = group.teams.some(team => team.id === match.team2.id);
      
      // Incluir partidos donde ambos equipos son del grupo Y el partido es de fase de grupos
      return team1InGroup && team2InGroup && (match.round === 'group' || match.round === 'interzonal');
    });

    // Calcular estadisticas con todos los partidos relevantes
    for (const match of relevantMatches) {
      if (match.team1Score !== undefined && match.team2Score !== undefined && match.winner) {
        stats[match.team1.id].totalMatches++;
        stats[match.team2.id].totalMatches++;
        
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
    }

    // Calcular porcentaje de victorias y diferencia de games
    Object.values(stats).forEach(stat => {
      stat.winPercentage = stat.totalMatches > 0 
        ? (stat.wins / stat.totalMatches) * 100 
        : 0;
      stat.gamesDifference = stat.gamesFor - stat.gamesAgainst;
    });

    // Ordenar por criterios de clasificación: victorias, diferencia de games, games a favor
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
  }



  static getTeamStats(tournamentId: string): TeamStats[] {
    const tournament = this.getTournament(tournamentId);
    if (!tournament) return [];

    const stats: { [teamId: string]: TeamStats } = {};
    
    // Inicializar estadisticas
    for (const team of tournament.teams) {
      stats[team.id] = {
        teamId: team.id,
        teamName: team.name,
        wins: 0,
        losses: 0,
        totalMatches: 0,
        winPercentage: 0,
        gamesFor: 0,
        gamesAgainst: 0,
        gamesDifference: 0,
      };
    }

    // Obtener todos los partidos incluyendo extra
    const allMatches = this.getAllMatches(tournamentId);

    // Contar todos los partidos completados
    for (const match of allMatches) {
      if (match.isCompleted && match.winner && match.team1Score !== undefined && match.team2Score !== undefined) {
        stats[match.team1.id].totalMatches++;
        stats[match.team2.id].totalMatches++;
        
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
    }

    // Calcular porcentaje de victorias y diferencia de games
    Object.values(stats).forEach(stat => {
      stat.winPercentage = stat.totalMatches > 0 
        ? (stat.wins / stat.totalMatches) * 100 
        : 0;
      stat.gamesDifference = stat.gamesFor - stat.gamesAgainst;
    });

    // Ordenar por criterios de clasificación: victorias, diferencia de games, games a favor
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
  }

  static getGroupStats(tournamentId: string): { [groupId: string]: TeamStats[] } {
    const tournament = this.getTournament(tournamentId);
    if (!tournament) return {};

    const groupStats: { [groupId: string]: TeamStats[] } = {};
    
    for (const group of tournament.groups) {
      groupStats[group.id] = this.calculateGroupStats(group, tournamentId);
    }

    return groupStats;
  }

  static deleteTournament(tournamentId: string): void {
    const tournaments = this.getStoredTournaments();
    const filteredTournaments = tournaments.filter(t => t.id !== tournamentId);
    this.saveTournaments(filteredTournaments);
  }

  // Funciones para generar manualmente las rondas
  static generateNextRound(tournamentId: string): Tournament {
    const tournaments = this.getStoredTournaments();
    const tournamentIndex = tournaments.findIndex(t => t.id === tournamentId);
    
    if (tournamentIndex === -1) {
      throw new Error('Tournament not found');
    }

    const tournament = tournaments[tournamentIndex];
    
    // Verificar que ronda se puede generar
    if (this.canGenerateQuarterfinals(tournament)) {
      tournament.quarterfinals = this.generateQuarterfinals(tournament);
    } else if (this.canGenerateSemifinals(tournament)) {
      tournament.semifinals = this.generateSemifinals(tournament);
    } else if (this.canGenerateFinal(tournament)) {
      tournament.final = this.generateFinal(tournament);
    } else {
      throw new Error('No se puede generar la siguiente ronda en este momento');
    }

    tournaments[tournamentIndex] = tournament;
    this.saveTournaments(tournaments);
    
    return tournament;
  }

  static canGenerateNextRound(tournamentId: string): { canGenerate: boolean; nextRound: string } {
    const tournament = this.getTournament(tournamentId);
    if (!tournament) {
      return { canGenerate: false, nextRound: '' };
    }

    if (this.canGenerateQuarterfinals(tournament)) {
      return { canGenerate: true, nextRound: 'Cuartos de Final' };
    } else if (this.canGenerateSemifinals(tournament)) {
      return { canGenerate: true, nextRound: 'Semifinales' };
    } else if (this.canGenerateFinal(tournament)) {
      return { canGenerate: true, nextRound: 'Final' };
    }

    return { canGenerate: false, nextRound: '' };
  }



  // Funcion para borrar un partido
  static deleteMatch(tournamentId: string, matchId: string): Tournament {
    const tournaments = this.getStoredTournaments();
    const tournamentIndex = tournaments.findIndex(t => t.id === tournamentId);
    
    if (tournamentIndex === -1) {
      throw new Error('Tournament not found');
    }

    const tournament = tournaments[tournamentIndex];
    
    // Buscar y borrar el partido en grupos
    for (const group of tournament.groups) {
      const matchIndex = group.matches.findIndex(m => m.id === matchId);
      if (matchIndex !== -1) {
        group.matches.splice(matchIndex, 1);
        tournaments[tournamentIndex] = tournament;
        this.saveTournaments(tournaments);
        return tournament;
      }
    }

    // Buscar y borrar en cuartos de final
    const quarterfinalIndex = tournament.quarterfinals.findIndex(m => m.id === matchId);
    if (quarterfinalIndex !== -1) {
      tournament.quarterfinals.splice(quarterfinalIndex, 1);
      tournaments[tournamentIndex] = tournament;
      this.saveTournaments(tournaments);
      return tournament;
    }

    // Buscar y borrar en semifinales
    const semifinalIndex = tournament.semifinals.findIndex(m => m.id === matchId);
    if (semifinalIndex !== -1) {
      tournament.semifinals.splice(semifinalIndex, 1);
      tournaments[tournamentIndex] = tournament;
      this.saveTournaments(tournaments);
      return tournament;
    }

    // Buscar y borrar en final
    if (tournament.final && tournament.final.id === matchId) {
      tournament.final = null;
      tournament.isCompleted = false;
      tournaments[tournamentIndex] = tournament;
      this.saveTournaments(tournaments);
      return tournament;
    }

    throw new Error('Match not found');
  }

  // Funcion para agregar un partido extra manualmente
  static addExtraMatch(
    tournamentId: string, 
    team1Id: string, 
    team2Id: string, 
    round: 'group' | 'quarterfinal' | 'semifinal' | 'final',
    groupId?: string
  ): Tournament {
    const tournaments = this.getStoredTournaments();
    const tournamentIndex = tournaments.findIndex(t => t.id === tournamentId);
    
    if (tournamentIndex === -1) {
      throw new Error('Tournament not found');
    }

    const tournament = tournaments[tournamentIndex];
    
    // Buscar los equipos
    const team1 = tournament.teams.find(t => t.id === team1Id);
    const team2 = tournament.teams.find(t => t.id === team2Id);
    
    if (!team1 || !team2) {
      throw new Error('One or both teams not found');
    }

    if (team1Id === team2Id) {
      throw new Error('Cannot create a match between the same team');
    }

    // Crear el nuevo partido
    const newMatch: Match = {
      id: `extra-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      team1,
      team2,
      isCompleted: false,
      round,
      groupId,
    };

    // Agregar el partido según la ronda
    if (round === 'group') {
      if (groupId) {
        // Si se especifica un grupo, agregar al grupo correspondiente
        const group = tournament.groups.find(g => g.id === groupId);
        if (!group) {
          throw new Error('Group not found');
        }
        group.matches.push(newMatch);
      } else {
        // Si no se especifica grupo, agregar como partido extra de grupo
        // Buscar el primer grupo disponible o crear uno temporal
        if (tournament.groups.length > 0) {
          // Agregar al primer grupo como partido extra
          tournament.groups[0].matches.push(newMatch);
        } else {
          throw new Error('No groups available for extra match');
        }
      }
    } else if (round === 'quarterfinal') {
      tournament.quarterfinals.push(newMatch);
    } else if (round === 'semifinal') {
      tournament.semifinals.push(newMatch);
    } else if (round === 'final') {
      if (tournament.final) {
        throw new Error('Final match already exists');
      }
      tournament.final = newMatch;
    }

    tournaments[tournamentIndex] = tournament;
    this.saveTournaments(tournaments);
    
    return tournament;
  }

  // Funcion para obtener todos los partidos de un torneo (incluyendo extra)
  static getAllMatches(tournamentId: string): Match[] {
    const tournament = this.getTournament(tournamentId);
    if (!tournament) return [];

    const allMatches: Match[] = [];
    
    // Partidos de grupos
    tournament.groups.forEach(group => {
      allMatches.push(...group.matches);
    });
    
    // Partidos de eliminación
    allMatches.push(...tournament.quarterfinals);
    allMatches.push(...tournament.semifinals);
    if (tournament.final) {
      allMatches.push(tournament.final);
    }
    
    return allMatches;
  }

  // Funcion para llenar aleatoriamente todos los partidos incompletos
  static fillAllMatchesRandomly(tournamentId: string): Tournament {
    const tournaments = this.getStoredTournaments();
    const tournamentIndex = tournaments.findIndex(t => t.id === tournamentId);
    
    if (tournamentIndex === -1) {
      throw new Error('Tournament not found');
    }

    const tournament = tournaments[tournamentIndex];
    
    // Función para generar un resultado aleatorio
    const generateRandomScore = () => {
      // Generar puntuaciones entre 0 y 6 (típico en pádel)
      const score1 = Math.floor(Math.random() * 7);
      const score2 = Math.floor(Math.random() * 7);
      
      // Asegurar que no sea empate (0-0 no es válido en pádel)
      if (score1 === score2) {
        return score1 === 0 ? [1, 0] : [score1, score2];
      }
      
      return [score1, score2];
    };

    // Llenar partidos de grupos
    for (const group of tournament.groups) {
      for (const match of group.matches) {
        if (!match.isCompleted) {
          const [score1, score2] = generateRandomScore();
          match.team1Score = score1;
          match.team2Score = score2;
          match.winner = score1 > score2 ? match.team1 : match.team2;
          match.isCompleted = true;
        }
      }
    }

    // Llenar cuartos de final
    for (const match of tournament.quarterfinals) {
      if (!match.isCompleted) {
        const [score1, score2] = generateRandomScore();
        match.team1Score = score1;
        match.team2Score = score2;
        match.winner = score1 > score2 ? match.team1 : match.team2;
        match.isCompleted = true;
      }
    }

    // Llenar semifinales
    for (const match of tournament.semifinals) {
      if (!match.isCompleted) {
        const [score1, score2] = generateRandomScore();
        match.team1Score = score1;
        match.team2Score = score2;
        match.winner = score1 > score2 ? match.team1 : match.team2;
        match.isCompleted = true;
      }
    }

    // Llenar final
    if (tournament.final && !tournament.final.isCompleted) {
      const [score1, score2] = generateRandomScore();
      tournament.final.team1Score = score1;
      tournament.final.team2Score = score2;
      tournament.final.winner = score1 > score2 ? tournament.final.team1 : tournament.final.team2;
      tournament.final.isCompleted = true;
      tournament.isCompleted = true;
    }

    tournaments[tournamentIndex] = tournament;
    this.saveTournaments(tournaments);
    
    return tournament;
  }
} 