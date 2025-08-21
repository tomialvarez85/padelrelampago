import { useState } from 'react';
import type { Team } from '../types';
import { Plus, X } from 'lucide-react';

interface AddExtraMatchProps {
  teams: Team[];
  onAddMatch: (team1Id: string, team2Id: string, round: 'group' | 'quarterfinal' | 'semifinal' | 'final', groupId?: string) => void;
  onCancel: () => void;
  groups?: { id: string; name: string }[];
}

export default function AddExtraMatch({
  teams,
  onAddMatch,
  onCancel,
  groups = [],
}: AddExtraMatchProps) {
  const [team1Id, setTeam1Id] = useState('');
  const [team2Id, setTeam2Id] = useState('');
  const [round, setRound] = useState<'group' | 'quarterfinal' | 'semifinal' | 'final'>('group');
  const [groupId, setGroupId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!team1Id || !team2Id) {
      alert('Por favor selecciona ambos equipos');
      return;
    }

    if (team1Id === team2Id) {
      alert('No puedes crear un partido entre el mismo equipo');
      return;
    }

    // Para partidos de grupo, el groupId es opcional
    // Si no se selecciona un grupo, se puede agregar como partido extra sin grupo específico
    onAddMatch(team1Id, team2Id, round, round === 'group' ? groupId || undefined : undefined);
  };

  return (
    <div className="add-extra-match-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Agregar Partido Extra</h3>
          <button onClick={onCancel} className="btn btn-icon">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-match-form">
          <div className="form-group">
            <label>Equipo 1:</label>
            <select
              value={team1Id}
              onChange={(e) => setTeam1Id(e.target.value)}
              className="input"
              required
            >
              <option value="">Selecciona un equipo</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Equipo 2:</label>
            <select
              value={team2Id}
              onChange={(e) => setTeam2Id(e.target.value)}
              className="input"
              required
            >
              <option value="">Selecciona un equipo</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Ronda:</label>
            <select
              value={round}
              onChange={(e) => setRound(e.target.value as any)}
              className="input"
              required
            >
              <option value="group">Grupo (Extra)</option>
              <option value="quarterfinal">Cuartos de Final</option>
              <option value="semifinal">Semifinal</option>
              <option value="final">Final</option>
            </select>
          </div>

          {round === 'group' && groups.length > 0 && (
            <div className="form-group">
              <label>Grupo (Opcional):</label>
              <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="input"
              >
                <option value="">Sin grupo específico (partido extra)</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              <small className="form-help">
                Si no seleccionas un grupo, el partido se agregará como extra sin afectar las estadísticas del grupo
              </small>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              <Plus size={16} />
              Agregar Partido
            </button>
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
