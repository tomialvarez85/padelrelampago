import type { Tournament } from '../types';
import { Trash2, Play, Eye } from 'lucide-react';

interface TournamentListProps {
  tournaments: Tournament[];
  onCreateTournament: () => void;
  onSelectTournament: (tournament: Tournament) => void;
  onDeleteTournament: (tournamentId: string) => void;
}

export default function TournamentList({
  tournaments,
  onCreateTournament,
  onSelectTournament,
  onDeleteTournament,
}: TournamentListProps) {
  const getStatusText = (tournament: Tournament) => {
    if (tournament.isCompleted) return 'Finalizado';
    if (tournament.isStarted) return 'En Progreso';
    return 'Pendiente';
  };

  const getStatusColor = (tournament: Tournament) => {
    if (tournament.isCompleted) return 'text-green-600';
    if (tournament.isStarted) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div className="tournament-list">
      <div className="tournament-list-header">
        <h2>Torneos</h2>
        <button 
          onClick={onCreateTournament}
          className="btn btn-primary"
        >
          Crear Nuevo Torneo
        </button>
      </div>

      {tournaments.length === 0 ? (
        <div className="empty-state">
          <p>No hay torneos creados</p>
          <button 
            onClick={onCreateTournament}
            className="btn btn-primary"
          >
            Crear tu primer torneo
          </button>
        </div>
      ) : (
        <div className="tournament-grid">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="tournament-card">
              <div className="tournament-card-header">
                <h3>{tournament.name}</h3>
                <span className={`status ${getStatusColor(tournament)}`}>
                  {getStatusText(tournament)}
                </span>
              </div>
              
              <div className="tournament-card-body">
                <p><strong>Equipos:</strong> {tournament.teams.length}</p>
                <p><strong>Creado:</strong> {new Date(tournament.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="tournament-card-actions">
                <button
                  onClick={() => onSelectTournament(tournament)}
                  className="btn btn-secondary"
                  title="Ver torneo"
                >
                  <Eye size={16} />
                  Ver
                </button>
                
                {!tournament.isStarted && (
                  <button
                    onClick={() => onSelectTournament(tournament)}
                    className="btn btn-primary"
                    title="Iniciar torneo"
                  >
                    <Play size={16} />
                    Iniciar
                  </button>
                )}
                
                <button
                  onClick={() => onDeleteTournament(tournament.id)}
                  className="btn btn-danger"
                  title="Eliminar torneo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 