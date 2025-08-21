import { useState } from 'react';
import { TournamentService } from '../services/tournamentService';
import type { Tournament, Group } from '../types';
import { ArrowLeft, Trophy, BarChart3, Users, Plus } from 'lucide-react';
import MatchCard from './MatchCard';
import GroupView from './GroupView';
import BracketView from './BracketView';
import StatsView from './StatsView';
import ManualGroupSetup from './ManualGroupSetup';
import AddExtraMatch from './AddExtraMatch';

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
  const [showAddMatch, setShowAddMatch] = useState(false);

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

  const handleDeleteMatch = (matchId: string) => {
    try {
      TournamentService.deleteMatch(tournament.id, matchId);
      onTournamentUpdated();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al borrar el partido');
    }
  };

  const handleAddExtraMatch = (
    team1Id: string,
    team2Id: string,
    round: 'group' | 'quarterfinal' | 'semifinal' | 'final',
    groupId?: string
  ) => {
    try {
      TournamentService.addExtraMatch(tournament.id, team1Id, team2Id, round, groupId);
      onTournamentUpdated();
      setShowAddMatch(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al agregar el partido extra');
    }
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



  const getCompletedMatchesCount = () => {
    let count = 0;
    
    // Contar partidos de grupos
    tournament.groups.forEach(group => {
      count += group.matches.filter(match => match.isCompleted).length;
    });
    
    // Contar partidos de eliminacion
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
    
    // Contar partidos de eliminacion
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
            <p>El torneo esta creado pero necesita que configures los grupos antes de iniciar las competencias.</p>
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
              Eliminacion
            </button>
            <button
              onClick={() => setView('stats')}
              className={`nav-btn ${view === 'stats' ? 'active' : ''}`}
            >
              <BarChart3 size={16} />
              Estadisticas
            </button>
          </div>

          <div className="tournament-content">
            {view === 'overview' && (
              <div className="overview">
                {/* Boton para generar siguiente ronda */}
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



                <div className="overview-section">
                  <div className="section-header">
                    <h3>Proximos Partidos</h3>
                    <button
                      onClick={() => setShowAddMatch(true)}
                      className="btn btn-primary btn-small"
                    >
                      <Plus size={16} />
                      Agregar Partido Extra
                    </button>
                  </div>
                  <div className="upcoming-matches">
                    {tournament.groups.flatMap(group => 
                      group.matches.filter(match => !match.isCompleted)
                    ).map(match => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        onResultSubmit={handleMatchResult}
                        onDelete={handleDeleteMatch}
                        showGroup={true}
                        isExtra={match.id.startsWith('extra-')}
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
                          onDelete={handleDeleteMatch}
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
                          onDelete={handleDeleteMatch}
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
                        onDelete={handleDeleteMatch}
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
                onDeleteMatch={handleDeleteMatch}
              />
            )}

            {view === 'bracket' && (
              <BracketView
                quarterfinals={tournament.quarterfinals}
                semifinals={tournament.semifinals}
                final={tournament.final}
                onMatchResult={handleMatchResult}
                onDeleteMatch={handleDeleteMatch}
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

      {showAddMatch && (
        <AddExtraMatch
          teams={tournament.teams}
          groups={tournament.groups.map(g => ({ id: g.id, name: g.name }))}
          onAddMatch={handleAddExtraMatch}
          onCancel={() => setShowAddMatch(false)}
        />
      )}
    </div>
  );
} 