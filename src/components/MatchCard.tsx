import { useState } from 'react';
import type { Match } from '../types';
import { Check, Edit } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  onResultSubmit: (matchId: string, team1Score: number, team2Score: number) => void;
  showGroup?: boolean;
}

export default function MatchCard({
  match,
  onResultSubmit,
  showGroup = false,
}: MatchCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [team1Score, setTeam1Score] = useState(match.team1Score?.toString() || '');
  const [team2Score, setTeam2Score] = useState(match.team2Score?.toString() || '');

  const handleSubmit = () => {
    const score1 = parseInt(team1Score);
    const score2 = parseInt(team2Score);
    
    if (isNaN(score1) || isNaN(score2)) {
      alert('Por favor ingresa puntuaciones validas');
      return;
    }
    
    onResultSubmit(match.id, score1, score2);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setTeam1Score(match.team1Score?.toString() || '');
    setTeam2Score(match.team2Score?.toString() || '');
    setIsEditing(true);
  };

  const getRoundLabel = () => {
    switch (match.round) {
      case 'group': return 'Grupo';
      case 'interzonal': return 'Interzonal';
      case 'quarterfinal': return 'Cuartos';
      case 'semifinal': return 'Semifinal';
      case 'final': return 'Final';
      default: return '';
    }
  };

  return (
    <div className={`match-card ${match.isCompleted ? 'completed' : ''}`}>
      <div className="match-header">
        <span className="match-round">{getRoundLabel()}</span>
        {showGroup && match.groupId && (
          <span className="match-group">Grupo {match.groupId.split('-')[1]}</span>
        )}
      </div>

      <div className="match-teams">
        <div className={`team ${match.winner?.id === match.team1.id ? 'winner' : ''}`}>
          <span className="team-name">{match.team1.name}</span>
          {match.isCompleted && (
            <span className="team-score">{match.team1Score}</span>
          )}
        </div>
        
        <div className="match-vs">vs</div>
        
        <div className={`team ${match.winner?.id === match.team2.id ? 'winner' : ''}`}>
          <span className="team-name">{match.team2.name}</span>
          {match.isCompleted && (
            <span className="team-score">{match.team2Score}</span>
          )}
        </div>
      </div>

      {!match.isCompleted && !isEditing && (
        <div className="match-actions">
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary btn-small"
          >
            <Edit size={14} />
            Ingresar Resultado
          </button>
        </div>
      )}

      {isEditing && (
        <div className="match-result-form">
          <div className="score-inputs">
            <div className="score-input">
              <label>{match.team1.name}</label>
              <input
                type="number"
                min="0"
                value={team1Score}
                onChange={(e) => setTeam1Score(e.target.value)}
                className="input"
              />
            </div>
            
            <div className="score-separator">-</div>
            
            <div className="score-input">
              <label>{match.team2.name}</label>
              <input
                type="number"
                min="0"
                value={team2Score}
                onChange={(e) => setTeam2Score(e.target.value)}
                className="input"
              />
            </div>
          </div>
          
          <div className="result-actions">
            <button onClick={handleSubmit} className="btn btn-primary btn-small">
              <Check size={14} />
              Guardar
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary btn-small"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {match.isCompleted && !isEditing && (
        <div className="match-actions">
          <button
            onClick={handleEdit}
            className="btn btn-secondary btn-small"
          >
            <Edit size={14} />
            Editar
          </button>
        </div>
      )}
    </div>
  );
} 