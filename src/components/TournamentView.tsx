import { useState } from 'react';
import { TournamentService } from '../services/tournamentService';
import type { Tournament, Group } from '../types';
import { ArrowLeft, Trophy, BarChart3, Users } from 'lucide-react';
import MatchCard from './MatchCard';
import GroupView from './GroupView';
import BracketView from './BracketView';
import StatsView from './StatsView';
import ManualGroupSetup from './ManualGroupSetup';

interface TournamentViewProps {
  tournament: Tournament;
  onBack: () => void;
  onTournamentUpdated: () => void;
}

type View = 'overview' | 'groups' | 'bracket' | 'stats' | 'manual-setup';

export default function TournamentView({
  tournament,
  onBack,
  onTournamentUpdated,
}: TournamentViewProps) {
  const [view, setView] = useState<View>('overview');

  const handleManualGroupsCreated = (groups: Group[]) => {
    try {
      TournamentService.startTournamentWithManualGroups(tournament.id, groups);
      onTournamentUpdated();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al crear los grupos');
    }
  };

  const handleMatchResult = (
    matchId: string,
    team1Score: number,
    team2Score: number
  ) => {
    TournamentService.updateMatchResult(tournament.id, matchId, team1Score, team2Score);
    onTournamentUpdated();
  };

  const handleGenerateNextRound = () => {
    try {
      TournamentService.generateNextRound(tournament.id);
      onTournamentUpdated();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al generar la siguiente ronda');
    }
  };

  const getNextRoundInfo = () => {
    return TournamentService.canGenerateNextRound(tournament.id);
  };

  const handleFillRandomResults = () => {
    try {
      TournamentService.fillRandomResults(tournament.id);
      onTournamentUpdated();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al rellenar resultados aleatorios');
    }
  };

  const handleFillRandomResultsForRound = (round: 'groups' | 'quarterfinals' | 'semifinals' | 'final') => {
    try {
      TournamentService.fillRandomResultsForRound(tournament.id, round);
      onTournamentUpdated();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al rellenar resultados aleatorios');
    }
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
            <span>{tournament.teams.length} parejas</span>
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
            <h3>Configurar Grupos</h3>
            <p>El torneo está creado pero necesita que configures los grupos antes de iniciar las competencias.</p>
            <div className="start-options">
              <button 
                onClick={() => setView('manual-setup')} 
                className="btn btn-primary btn-large"
              >
                <Users size={20} />
                Configurar Grupos
              </button>
            </div>
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
                {/* Botón para generar siguiente ronda */}
                {(() => {
                  const nextRoundInfo = getNextRoundInfo();
                  if (nextRoundInfo.canGenerate) {
                    return (
                      <div className="next-round-section">
                        <div className="next-round-info">
                          <h3>Generar Siguiente Ronda</h3>
                          <p>Se pueden generar los {nextRoundInfo.nextRound}</p>
                        </div>
                        <button 
                          onClick={handleGenerateNextRound}
                          className="btn btn-primary btn-large"
                        >
                          <Trophy size={20} />
                          Generar {nextRoundInfo.nextRound}
                        </button>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Botones para rellenar resultados aleatorios */}
                <div className="random-results-section">
                  <div className="random-results-info">
                    <h3>Rellenar Resultados Aleatorios</h3>
                    <p>Rellena automáticamente todos los partidos pendientes con resultados aleatorios</p>
                  </div>
                  <div className="random-results-buttons">
                    <button 
                      onClick={handleFillRandomResults}
                      className="btn btn-secondary btn-large"
                    >
                      🎲 Rellenar Todos los Partidos
                    </button>
                    <div className="round-specific-buttons">
                      <button 
                        onClick={() => handleFillRandomResultsForRound('groups')}
                        className="btn btn-small"
                      >
                        🎲 Grupos
                      </button>
                      {tournament.quarterfinals.length > 0 && (
                        <button 
                          onClick={() => handleFillRandomResultsForRound('quarterfinals')}
                          className="btn btn-small"
                        >
                          🎲 Cuartos
                        </button>
                      )}
                      {tournament.semifinals.length > 0 && (
                        <button 
                          onClick={() => handleFillRandomResultsForRound('semifinals')}
                          className="btn btn-small"
                        >
                          🎲 Semifinales
                        </button>
                      )}
                      {tournament.final && (
                        <button 
                          onClick={() => handleFillRandomResultsForRound('final')}
                          className="btn btn-small"
                        >
                          🎲 Final
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="overview-section">
                  <h3>Próximos Partidos</h3>
                  <div className="upcoming-matches">
                    {tournament.groups.flatMap(group => 
                      group.matches.filter(match => !match.isCompleted)
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

            {view === 'manual-setup' && (
              <ManualGroupSetup
                teams={tournament.teams}
                onGroupsCreated={handleManualGroupsCreated}
                onBack={() => setView('overview')}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
} 