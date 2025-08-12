import { useState } from 'react';
import { TournamentService } from '../services/tournamentService';
import type { Tournament } from '../types';
import { ArrowLeft, Play, Trophy, BarChart3 } from 'lucide-react';
import MatchCard from './MatchCard';
import GroupView from './GroupView';
import BracketView from './BracketView';
import StatsView from './StatsView';

interface TournamentViewProps {
  tournament: Tournament;
  onBack: () => void;
  onTournamentUpdated: () => void;
}

type View = 'overview' | 'groups' | 'bracket' | 'stats';

export default function TournamentView({
  tournament,
  onBack,
  onTournamentUpdated,
}: TournamentViewProps) {
  const [view, setView] = useState<View>('overview');

  const handleStartTournament = () => {
    TournamentService.startTournament(tournament.id);
    onTournamentUpdated();
  };

  const handleMatchResult = (
    matchId: string,
    team1Score: number,
    team2Score: number
  ) => {
    TournamentService.updateMatchResult(tournament.id, matchId, team1Score, team2Score);
    onTournamentUpdated();
  };

  const getCompletedMatchesCount = () => {
    let count = 0;
    
    // Contar partidos de grupos
    tournament.groups.forEach(group => {
      count += group.matches.filter(match => match.isCompleted).length;
    });
    
    // Contar partidos de eliminación
    count += tournament.quarterfinals.filter(match => match.isCompleted).length;
    count += tournament.semifinals.filter(match => match.isCompleted).length;
    if (tournament.final?.isCompleted) count++;
    
    return count;
  };

  const getTotalMatchesCount = () => {
    let count = 0;
    
    // Contar partidos de grupos
    tournament.groups.forEach(group => {
      count += group.matches.length;
    });
    
    // Contar partidos de eliminación
    count += tournament.quarterfinals.length;
    count += tournament.semifinals.length;
    if (tournament.final) count++;
    
    return count;
  };

  return (
    <div className="tournament-view">
      <div className="tournament-view-header">
        <button onClick={onBack} className="btn btn-secondary">
          <ArrowLeft size={16} />
          Volver
        </button>
        <div className="tournament-info">
          <h2>{tournament.name}</h2>
          <div className="tournament-stats">
            <span>{tournament.teams.length} equipos</span>
            <span>•</span>
            <span>{getCompletedMatchesCount()}/{getTotalMatchesCount()} partidos</span>
            {tournament.isCompleted && (
              <>
                <span>•</span>
                <span className="completed">Finalizado</span>
              </>
            )}
          </div>
        </div>
      </div>

      {!tournament.isStarted ? (
        <div className="tournament-not-started">
          <div className="start-tournament-card">
            <h3>Iniciar Torneo</h3>
            <p>El torneo está listo para comenzar. Se crearán grupos aleatorios y se generarán los partidos.</p>
            <button onClick={handleStartTournament} className="btn btn-primary btn-large">
              <Play size={20} />
              Iniciar Torneo
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="tournament-navigation">
            <button
              onClick={() => setView('overview')}
              className={`nav-btn ${view === 'overview' ? 'active' : ''}`}
            >
              Resumen
            </button>
            <button
              onClick={() => setView('groups')}
              className={`nav-btn ${view === 'groups' ? 'active' : ''}`}
            >
              Grupos
            </button>
            <button
              onClick={() => setView('bracket')}
              className={`nav-btn ${view === 'bracket' ? 'active' : ''}`}
            >
              <Trophy size={16} />
              Eliminación
            </button>
            <button
              onClick={() => setView('stats')}
              className={`nav-btn ${view === 'stats' ? 'active' : ''}`}
            >
              <BarChart3 size={16} />
              Estadísticas
            </button>
          </div>

          <div className="tournament-content">
            {view === 'overview' && (
              <div className="overview">
                <div className="overview-section">
                  <h3>Próximos Partidos</h3>
                  <div className="upcoming-matches">
                    {tournament.groups.flatMap(group => 
                      group.matches.filter(match => !match.isCompleted).slice(0, 3)
                    ).map(match => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        onResultSubmit={handleMatchResult}
                        showGroup={true}
                      />
                    ))}
                  </div>
                </div>

                {tournament.quarterfinals.length > 0 && (
                  <div className="overview-section">
                    <h3>Cuartos de Final</h3>
                    <div className="elimination-matches">
                      {tournament.quarterfinals.map(match => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          onResultSubmit={handleMatchResult}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {tournament.semifinals.length > 0 && (
                  <div className="overview-section">
                    <h3>Semifinales</h3>
                    <div className="elimination-matches">
                      {tournament.semifinals.map(match => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          onResultSubmit={handleMatchResult}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {tournament.final && (
                  <div className="overview-section">
                    <h3>Final</h3>
                    <div className="final-match">
                      <MatchCard
                        match={tournament.final}
                        onResultSubmit={handleMatchResult}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {view === 'groups' && (
              <GroupView
                groups={tournament.groups}
                onMatchResult={handleMatchResult}
              />
            )}

            {view === 'bracket' && (
              <BracketView
                quarterfinals={tournament.quarterfinals}
                semifinals={tournament.semifinals}
                final={tournament.final}
                onMatchResult={handleMatchResult}
              />
            )}

            {view === 'stats' && (
              <StatsView tournamentId={tournament.id} />
            )}
          </div>
        </>
      )}
    </div>
  );
} 