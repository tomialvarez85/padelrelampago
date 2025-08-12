export interface Player {
  id: string;
  lastName: string;
}

export interface Team {
  id: string;
  player1: Player;
  player2: Player;
  name: string;
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  team1Score?: number;
  team2Score?: number;
  winner?: Team;
  isCompleted: boolean;
  round: 'group' | 'interzonal' | 'quarterfinal' | 'semifinal' | 'final';
  groupId?: string;
}

export interface Group {
  id: string;
  name: string;
  teams: Team[];
  matches: Match[];
}

export interface Tournament {
  id: string;
  name: string;
  teams: Team[];
  groups: Group[];
  quarterfinals: Match[];
  semifinals: Match[];
  final: Match | null;
  isStarted: boolean;
  isCompleted: boolean;
  createdAt: Date;
}

export interface TeamStats {
  teamId: string;
  teamName: string;
  wins: number;
  losses: number;
  totalMatches: number;
  winPercentage: number;
} 