import { useState } from 'react';
import { TournamentService } from '../services/tournamentService';
import type { Team, Player } from '../types';
import { ArrowLeft, Plus, X, Users } from 'lucide-react';

interface CreateTournamentProps {
  onTournamentCreated: (tournamentId: string) => void;
  onBack: () => void;
}

export default function CreateTournament({
  onTournamentCreated,
  onBack,
}: CreateTournamentProps) {
  const [tournamentName, setTournamentName] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [player1LastName, setPlayer1LastName] = useState('');
  const [player2LastName, setPlayer2LastName] = useState('');
  const [autoTeamCount, setAutoTeamCount] = useState<number | undefined>(undefined);

  // Lista de apellidos comunes para generar aleatoriamente
  const randomSurnames = [
    'Garcia', 'Rodriguez', 'Lopez', 'Martinez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez',
    'Torres', 'Flores', 'Rivera', 'Morales', 'Cruz', 'Ortiz', 'Silva', 'Reyes',
    'Moreno', 'Jimenez', 'Diaz', 'Romero', 'Herrera', 'Ruiz', 'Vargas', 'Mendoza',
    'Castro', 'Fernandez', 'Gutierrez', 'Ramos', 'Alvarez', 'Molina', 'Navarro', 'Delgado',
    'Vega', 'Rojas', 'Campos', 'Guerrero', 'Cortes', 'Paredes', 'Salazar', 'Vasquez',
    'Acosta', 'Figueroa', 'Lara', 'Bravo', 'Miranda', 'Valenzuela', 'Tapia', 'Espinoza',
    'Fuentes', 'Aguilar', 'Zuniga', 'Cardenas', 'Soto', 'Contreras', 'Valdez', 'Castillo',
    'Carrasco', 'Cordova', 'Escobar', 'Ponce', 'Medina', 'Sepulveda', 'Herrera', 'Riquelme',
    'Araya', 'Leiva', 'Toro', 'Vergara', 'Maldonado', 'Bustos', 'Carvajal', 'Donoso',
    'Farias', 'Gallardo', 'Henriquez', 'Ibarra', 'Jara', 'Klein', 'Lagos', 'Mansilla'
  ];

  const generateRandomTeams = () => {
    if (!autoTeamCount || autoTeamCount < 4 || autoTeamCount > 16) {
      alert('Por favor ingresa un numero de parejas entre 4 y 16');
      return;
    }

    const shuffledSurnames = [...randomSurnames].sort(() => Math.random() - 0.5);
    const newTeams: Team[] = [];

    for (let i = 0; i < autoTeamCount; i++) {
      const player1: Player = {
        id: `auto-player-${Date.now()}-${i}-1`,
        lastName: shuffledSurnames[i * 2],
      };

      const player2: Player = {
        id: `auto-player-${Date.now()}-${i}-2`,
        lastName: shuffledSurnames[i * 2 + 1],
      };

      const team: Team = {
        id: `auto-team-${Date.now()}-${i}`,
        player1,
        player2,
        name: `${player1.lastName} & ${player2.lastName}`,
      };

      newTeams.push(team);
    }

    setTeams(newTeams);
  };

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
    if (!tournamentName.trim()) {
      alert('Por favor ingresa el nombre del torneo');
      return;
    }
    
    if (teams.length < 4) {
      alert('Se necesitan al menos 4 parejas para crear un torneo');
      return;
    }

    const tournament = TournamentService.createTournament(teams, tournamentName.trim());
    onTournamentCreated(tournament.id);
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
        <div className="tournament-name-form">
          <h3>Informacion del Torneo</h3>
          <div className="tournament-name-input">
            <div className="input-group">
              <label htmlFor="tournamentName">Nombre del Torneo:</label>
              <input
                id="tournamentName"
                type="text"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
                placeholder="Ej: Torneo de Verano 2024"
                className="input"
              />
            </div>
          </div>
        </div>

        <div className="auto-team-form">
                      <h3>Generar Parejas Automaticamente</h3>
          <div className="auto-team-inputs">
            <div className="input-group">
                              <label htmlFor="autoTeamCount">Numero de Parejas:</label>
              <input
                id="autoTeamCount"
                type="number"
                min="4"
                max="16"
                value={autoTeamCount || ''}
                onChange={(e) => setAutoTeamCount(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="4-16"
                className="input"
              />
            </div>
            
            <button 
              onClick={generateRandomTeams} 
              className="btn btn-secondary"
              disabled={!autoTeamCount}
            >
              <Users size={16} />
              Generar {autoTeamCount || 'X'} Parejas Aleatorias
            </button>
          </div>
                        <p className="info-text">
                Esta opcion generara automaticamente el numero especificado de parejas con apellidos aleatorios.
              </p>
        </div>

        <div className="team-form">
          <h3>Agregar Pareja Manualmente</h3>
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
              Agregar Pareja
            </button>
          </div>
        </div>

        <div className="teams-list">
          <h3>Parejas ({teams.length})</h3>
          {teams.length === 0 ? (
                          <p className="empty-teams">No hay parejas agregadas</p>
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
                    title="Eliminar pareja"
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
            disabled={teams.length < 4 || !tournamentName.trim()}
            className="btn btn-primary btn-large"
          >
            Crear Torneo y Configurar Grupos: {tournamentName.trim() || 'Sin nombre'} ({teams.length} parejas)
          </button>
          
          {!tournamentName.trim() && (
            <p className="warning">
              Por favor ingresa el nombre del torneo
            </p>
          )}
          {tournamentName.trim() && teams.length < 4 && (
            <p className="warning">
              Se necesitan al menos 4 parejas para crear un torneo
            </p>
          )}
          
                     {teams.length >= 4 && (
             <div className="group-info">
               <h4>Proximo Paso:</h4>
               <p className="info-text">
                 Despues de crear el torneo, configuraras los grupos manualmente antes de iniciar las competencias.
               </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
} 