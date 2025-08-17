import type { Match } from '../types';
import MatchCard from './MatchCard';

interface BracketViewProps {
  quarterfinals: Match[];
  semifinals: Match[];
  final: Match | null;
  onMatchResult: (matchId: string, team1Score: number, team2Score: number) => void;
}

export default function BracketView({
  quarterfinals,
  semifinals,
  final,
  onMatchResult,
}: BracketViewProps) {
  return (
    <div className="bracket-view">
      <h2>Fase de Eliminacion</h2>
      
      <div className="bracket-container">
        {/* Cuartos de Final - solo mostrar si existen */}
        {quarterfinals.length > 0 && (
          <div className="bracket-round quarterfinals">
            <h3>Cuartos de Final</h3>
            <div className="bracket-matches">
              {quarterfinals.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onResultSubmit={onMatchResult}
                />
              ))}
            </div>
          </div>
        )}

        {/* Semifinales */}
        <div className="bracket-round semifinals">
          <h3>Semifinales</h3>
          {semifinals.length === 0 ? (
            <p className="no-matches">
              {quarterfinals.length === 0 
                        ? 'Las semifinales se generaran automaticamente cuando se completen todos los partidos del grupo unico.'
        : 'Las semifinales se generaran automaticamente cuando se completen todos los cuartos de final.'
              }
            </p>
          ) : (
            <div className="bracket-matches">
              {semifinals.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onResultSubmit={onMatchResult}
                />
              ))}
            </div>
          )}
        </div>

        {/* Final */}
        <div className="bracket-round final">
          <h3>Final</h3>
          {!final ? (
            <p className="no-matches">
              La final se generara automaticamente cuando se completen todas las semifinales.
            </p>
          ) : (
            <div className="final-match">
              <MatchCard
                match={final}
                onResultSubmit={onMatchResult}
              />
            </div>
          )}
        </div>
      </div>

              {/* Campeon */}
      {final?.isCompleted && final.winner && (
        <div className="champion-section">
          <div className="champion-card">
                            <h3>🏆 Campeon</h3>
            <div className="champion-team">
              <h2>{final.winner.name}</h2>
              <p>{final.winner.player1.lastName} & {final.winner.player2.lastName}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 