import { useState } from 'react';
import { TournamentService } from '../services/tournamentService';
import type { Team, Player } from '../types';
import { ArrowLeft, Plus, X } from 'lucide-react';

interface CreateTournamentProps {
  onTournamentCreated: () => void;
  onBack: () => void;
}

export default function CreateTournament({
  onTournamentCreated,
  onBack,
}: CreateTournamentProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [player1LastName, setPlayer1LastName] = useState('');
  const [player2LastName, setPlayer2LastName] = useState('');

  const addTeam = () => {
    if (!player1LastName.trim() || !player2LastName.trim()) {
      alert('Por favor ingresa los apellidos de ambos jugadores');
      return;
    }

    const player1: Player = {
      id: `player-${Date.now()}-1`,
      lastName: player1LastName.trim(),
    };

    const player2: Player = {
      id: `player-${Date.now()}-2`,
      lastName: player2LastName.trim(),
    };

    const team: Team = {
      id: `team-${Date.now()}`,
      player1,
      player2,
      name: `${player1.lastName} & ${player2.lastName}`,
    };

    setTeams([...teams, team]);
    setPlayer1LastName('');
    setPlayer2LastName('');
  };

  const removeTeam = (teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
  };

  const createTournament = () => {
    if (teams.length < 4) {
      alert('Se necesitan al menos 4 equipos para crear un torneo');
      return;
    }

    TournamentService.createTournament(teams);
    onTournamentCreated();
  };

  return (
    <div className="create-tournament">
      <div className="create-tournament-header">
        <button onClick={onBack} className="btn btn-secondary">
          <ArrowLeft size={16} />
          Volver
        </button>
        <h2>Crear Nuevo Torneo</h2>
      </div>

      <div className="create-tournament-content">
        <div className="team-form">
          <h3>Agregar Equipo</h3>
          <div className="team-inputs">
            <div className="input-group">
              <label htmlFor="player1">Apellido Jugador 1:</label>
              <input
                id="player1"
                type="text"
                value={player1LastName}
                onChange={(e) => setPlayer1LastName(e.target.value)}
                placeholder="Apellido del primer jugador"
                className="input"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="player2">Apellido Jugador 2:</label>
              <input
                id="player2"
                type="text"
                value={player2LastName}
                onChange={(e) => setPlayer2LastName(e.target.value)}
                placeholder="Apellido del segundo jugador"
                className="input"
              />
            </div>
            
            <button onClick={addTeam} className="btn btn-primary">
              <Plus size={16} />
              Agregar Equipo
            </button>
          </div>
        </div>

        <div className="teams-list">
          <h3>Equipos ({teams.length})</h3>
          {teams.length === 0 ? (
            <p className="empty-teams">No hay equipos agregados</p>
          ) : (
            <div className="teams-grid">
              {teams.map((team) => (
                <div key={team.id} className="team-card">
                  <div className="team-info">
                    <h4>{team.name}</h4>
                    <p>{team.player1.lastName} & {team.player2.lastName}</p>
                  </div>
                  <button
                    onClick={() => removeTeam(team.id)}
                    className="btn btn-danger btn-small"
                    title="Eliminar equipo"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="create-tournament-actions">
          <button
            onClick={createTournament}
            disabled={teams.length < 4}
            className="btn btn-primary btn-large"
          >
            Crear Torneo ({teams.length} equipos)
          </button>
          
          {teams.length < 4 && (
            <p className="warning">
              Se necesitan al menos 4 equipos para crear un torneo
            </p>
          )}
          
          {teams.length >= 4 && (
            <div className="group-info">
              <h4>Distribución de Grupos:</h4>
              <ul>
                {teams.length === 4 && (
                  <li>1 grupo único con 4 equipos</li>
                )}
                {teams.length === 5 && (
                  <li>1 grupo único con 5 equipos</li>
                )}
                {teams.length === 6 && (
                  <li>2 grupos de 3 equipos cada uno</li>
                )}
                {teams.length === 7 && (
                  <li>1 grupo de 3 equipos y 1 grupo de 4 equipos</li>
                )}
                {teams.length === 8 && (
                  <li>2 grupos de 4 equipos cada uno</li>
                )}
                {teams.length > 8 && teams.length <= 12 && (
                  <li>3 grupos de {Math.ceil(teams.length / 3)} equipos cada uno</li>
                )}
                {teams.length > 12 && (
                  <li>4 grupos de {Math.ceil(teams.length / 4)} equipos cada uno</li>
                )}
              </ul>
              <p className="info-text">
                {teams.length === 4 
                  ? 'Todos los equipos se enfrentarán entre sí y clasificarán a semifinales.'
                  : teams.length === 5
                  ? 'Todos los equipos se enfrentarán entre sí. Los 4 mejores clasificarán a semifinales.'
                  : teams.length === 6
                  ? 'Cada equipo jugará 2 partidos dentro de su grupo y 1 partido interzonal. Los 4 mejores clasificarán a cuartos de final.'
                  : teams.length === 7
                  ? 'Cada equipo jugará todos contra todos dentro de su grupo. Los 4 mejores clasificarán a cuartos de final.'
                  : teams.length === 8
                  ? 'Cada equipo jugará todos contra todos dentro de su grupo. Los 2 primeros de cada grupo clasificarán a cuartos de final.'
                  : 'Todos los equipos se enfrentarán entre sí dentro de su grupo.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 