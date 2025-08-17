import { useState, useEffect } from 'react';
import type { Team, Group } from '../types';
import { ArrowLeft, Users, Shuffle, Plus, X, Edit } from 'lucide-react';

interface ManualGroupSetupProps {
  teams: Team[];
  onGroupsCreated: (groups: Group[]) => void;
  onBack: () => void;
}

export default function ManualGroupSetup({
  teams,
  onGroupsCreated,
  onBack,
}: ManualGroupSetupProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [unassignedTeams, setUnassignedTeams] = useState<Team[]>([]);
  const [groupCount, setGroupCount] = useState<number>(2);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState<string>('');

      // Calcular numero optimo de grupos segun las reglas especificas
  const calculateOptimalGroups = () => {
    const totalTeams = teams.length;
      if (totalTeams <= 6) return 1; // 4, 5, 6 parejas: 1 grupo unico
  if (totalTeams <= 8) return 2; // 7, 8 parejas: 2 grupos
  if (totalTeams <= 10) return 2; // 9, 10 parejas: 2 grupos
  if (totalTeams <= 12) return 3; // 11, 12 parejas: 3 grupos
  if (totalTeams <= 14) return 4; // 13, 14 parejas: 4 grupos
  if (totalTeams <= 16) return 4; // 15, 16 parejas: 4 grupos
    return Math.ceil(totalTeams / 4);
  };

  // Inicializar cuando se carga el componente
  useEffect(() => {
    const optimalGroups = calculateOptimalGroups();
    setGroupCount(optimalGroups);
    createEmptyGroups(optimalGroups);
    setUnassignedTeams([...teams]);
  }, [teams]);

      // Crear grupos vacios
  const createEmptyGroups = (count: number) => {
    const newGroups: Group[] = [];
    for (let i = 0; i < count; i++) {
      newGroups.push({
        id: `group-${i + 1}`,
        name: `Grupo ${String.fromCharCode(65 + i)}`,
        teams: [],
        matches: [],
      });
    }
    setGroups(newGroups);
  };

      // Distribuir parejas automaticamente segun las reglas especificas
  const distributeAutomatically = () => {
    const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
    const newGroups: Group[] = [];
    const totalTeams = teams.length;
    
    // Crear grupos segun las reglas especificas
    if (totalTeams <= 6) {
              // 4, 5, 6 parejas: 1 grupo unico
      newGroups.push({
        id: 'group-1',
                  name: 'Grupo Unico',
        teams: shuffledTeams,
        matches: [],
      });
    } else if (totalTeams === 7) {
      // 7 parejas: 1 grupo de 4 y 1 grupo de 3
      newGroups.push({
        id: 'group-1',
        name: 'Grupo A',
        teams: shuffledTeams.slice(0, 4),
        matches: [],
      });
      newGroups.push({
        id: 'group-2',
        name: 'Grupo B',
        teams: shuffledTeams.slice(4, 7),
        matches: [],
      });
    } else if (totalTeams === 8) {
      // 8 parejas: 2 grupos de 4
      newGroups.push({
        id: 'group-1',
        name: 'Grupo A',
        teams: shuffledTeams.slice(0, 4),
        matches: [],
      });
      newGroups.push({
        id: 'group-2',
        name: 'Grupo B',
        teams: shuffledTeams.slice(4, 8),
        matches: [],
      });
    } else if (totalTeams === 9) {
      // 9 parejas: 1 grupo de 4 y 1 grupo de 5
      newGroups.push({
        id: 'group-1',
        name: 'Grupo A',
        teams: shuffledTeams.slice(0, 4),
        matches: [],
      });
      newGroups.push({
        id: 'group-2',
        name: 'Grupo B',
        teams: shuffledTeams.slice(4, 9),
        matches: [],
      });
    } else if (totalTeams === 10) {
      // 10 parejas: 2 grupos de 5
      newGroups.push({
        id: 'group-1',
        name: 'Grupo A',
        teams: shuffledTeams.slice(0, 5),
        matches: [],
      });
      newGroups.push({
        id: 'group-2',
        name: 'Grupo B',
        teams: shuffledTeams.slice(5, 10),
        matches: [],
      });
    } else if (totalTeams === 11) {
      // 11 parejas: 1 grupo de 5 y 1 grupo de 6
      newGroups.push({
        id: 'group-1',
        name: 'Grupo A',
        teams: shuffledTeams.slice(0, 5),
        matches: [],
      });
      newGroups.push({
        id: 'group-2',
        name: 'Grupo B',
        teams: shuffledTeams.slice(5, 11),
        matches: [],
      });
    } else if (totalTeams === 12) {
      // 12 parejas: 3 grupos de 4
      newGroups.push({
        id: 'group-1',
        name: 'Grupo A',
        teams: shuffledTeams.slice(0, 4),
        matches: [],
      });
      newGroups.push({
        id: 'group-2',
        name: 'Grupo B',
        teams: shuffledTeams.slice(4, 8),
        matches: [],
      });
      newGroups.push({
        id: 'group-3',
        name: 'Grupo C',
        teams: shuffledTeams.slice(8, 12),
        matches: [],
      });
    } else if (totalTeams === 13) {
      // 13 parejas: 2 grupos de 4 y 1 grupo de 5
      newGroups.push({
        id: 'group-1',
        name: 'Grupo A',
        teams: shuffledTeams.slice(0, 4),
        matches: [],
      });
      newGroups.push({
        id: 'group-2',
        name: 'Grupo B',
        teams: shuffledTeams.slice(4, 8),
        matches: [],
      });
      newGroups.push({
        id: 'group-3',
        name: 'Grupo C',
        teams: shuffledTeams.slice(8, 13),
        matches: [],
      });
    } else if (totalTeams === 14) {
      // 14 parejas: 2 grupos de 4 y 2 grupos de 3
      newGroups.push({
        id: 'group-1',
        name: 'Grupo A',
        teams: shuffledTeams.slice(0, 4),
        matches: [],
      });
      newGroups.push({
        id: 'group-2',
        name: 'Grupo B',
        teams: shuffledTeams.slice(4, 8),
        matches: [],
      });
      newGroups.push({
        id: 'group-3',
        name: 'Grupo C',
        teams: shuffledTeams.slice(8, 11),
        matches: [],
      });
      newGroups.push({
        id: 'group-4',
        name: 'Grupo D',
        teams: shuffledTeams.slice(11, 14),
        matches: [],
      });
    } else if (totalTeams === 15) {
      // 15 parejas: 3 grupos de 5
      newGroups.push({
        id: 'group-1',
        name: 'Grupo A',
        teams: shuffledTeams.slice(0, 5),
        matches: [],
      });
      newGroups.push({
        id: 'group-2',
        name: 'Grupo B',
        teams: shuffledTeams.slice(5, 10),
        matches: [],
      });
      newGroups.push({
        id: 'group-3',
        name: 'Grupo C',
        teams: shuffledTeams.slice(10, 15),
        matches: [],
      });
    } else if (totalTeams === 16) {
      // 16 parejas: 4 grupos de 4
      newGroups.push({
        id: 'group-1',
        name: 'Grupo A',
        teams: shuffledTeams.slice(0, 4),
        matches: [],
      });
      newGroups.push({
        id: 'group-2',
        name: 'Grupo B',
        teams: shuffledTeams.slice(4, 8),
        matches: [],
      });
      newGroups.push({
        id: 'group-3',
        name: 'Grupo C',
        teams: shuffledTeams.slice(8, 12),
        matches: [],
      });
      newGroups.push({
        id: 'group-4',
        name: 'Grupo D',
        teams: shuffledTeams.slice(12, 16),
        matches: [],
      });
    } else {
      // Para mas de 16 parejas, distribucion general
      for (let i = 0; i < groupCount; i++) {
        newGroups.push({
          id: `group-${i + 1}`,
          name: `Grupo ${String.fromCharCode(65 + i)}`,
          teams: [],
          matches: [],
        });
      }
      
      shuffledTeams.forEach((team, index) => {
        const groupIndex = index % groupCount;
        newGroups[groupIndex].teams.push(team);
      });
    }
    
    setGroups(newGroups);
    setGroupCount(newGroups.length);
    setUnassignedTeams([]);
  };

  // Agregar pareja a un grupo
  const addTeamToGroup = (team: Team, groupId: string) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId 
          ? { ...group, teams: [...group.teams, team] }
          : group
      )
    );
    setUnassignedTeams(prev => prev.filter(t => t.id !== team.id));
  };

  // Remover pareja de un grupo
  const removeTeamFromGroup = (team: Team, groupId: string) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId 
          ? { ...group, teams: group.teams.filter(t => t.id !== team.id) }
          : group
      )
    );
    setUnassignedTeams(prev => [...prev, team]);
  };

      // Iniciar edicion del nombre del grupo
  const startEditingGroupName = (group: Group) => {
    setEditingGroupId(group.id);
    setEditingGroupName(group.name);
  };

  // Guardar el nombre del grupo
  const saveGroupName = () => {
    if (editingGroupName.trim()) {
      setGroups(prevGroups => 
        prevGroups.map(group => 
          group.id === editingGroupId 
            ? { ...group, name: editingGroupName.trim() }
            : group
        )
      );
    }
    setEditingGroupId(null);
    setEditingGroupName('');
  };

      // Cancelar edicion del nombre del grupo
  const cancelEditingGroupName = () => {
    setEditingGroupId(null);
    setEditingGroupName('');
  };

  // Generar partidos para un grupo
  const generateMatches = (group: Group) => {
    const matches = [];
    for (let i = 0; i < group.teams.length; i++) {
      for (let j = i + 1; j < group.teams.length; j++) {
        matches.push({
          id: `${group.id}-match-${i}-${j}`,
          team1: group.teams[i],
          team2: group.teams[j],
          isCompleted: false,
          round: 'group' as const,
          groupId: group.id,
        });
      }
    }
    return matches;
  };

  // Crear grupos y iniciar torneo
  const createGroups = () => {
    const finalGroups = groups.map(group => ({
      ...group,
      matches: generateMatches(group),
    }));
    onGroupsCreated(finalGroups);
  };

  // Verificar si se pueden crear los grupos
  const canCreateGroups = () => {
    const totalAssigned = groups.reduce((sum, group) => sum + group.teams.length, 0);
    return totalAssigned === teams.length && groups.every(group => group.teams.length >= 2);
  };

      // Cambiar numero de grupos
  const handleGroupCountChange = (count: number) => {
    setGroupCount(count);
    createEmptyGroups(count);
    setUnassignedTeams([...teams]);
  };

  return (
    <div className="manual-group-setup">
      {/* Header */}
      <div className="setup-header">
        <button onClick={onBack} className="btn btn-secondary">
          <ArrowLeft size={16} />
          Volver
        </button>
        <h2>Configurar Grupos</h2>
        <p>Distribuye las parejas en los grupos antes de iniciar el torneo</p>
      </div>

      {/* Controles */}
      <div className="setup-controls">
        <div className="control-group">
                      <label htmlFor="groupCount">Numero de grupos:</label>
          <select
            id="groupCount"
            value={groupCount}
            onChange={(e) => handleGroupCountChange(parseInt(e.target.value))}
          >
            {Array.from({ length: 6 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={distributeAutomatically}
          className="btn btn-secondary"
        >
          <Shuffle size={16} />
                      Distribuir Segun Reglas
        </button>
      </div>

      {/* Contenido principal */}
      <div className="setup-content">
        {/* Parejas sin asignar */}
        <div className="unassigned-section">
          <h3>Parejas sin asignar ({unassignedTeams.length})</h3>
          <div className="unassigned-teams">
            {unassignedTeams.length === 0 ? (
              <p className="empty-message">Todas las parejas estan asignadas</p>
            ) : (
              unassignedTeams.map(team => (
                <div key={team.id} className="team-item unassigned">
                  <span>{team.name}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Grupos */}
        <div className="groups-section">
          <h3>Grupos</h3>
          <div className="groups-grid">
            {groups.map(group => (
              <div key={group.id} className="group-card">
                <div className="group-header">
                  {editingGroupId === group.id ? (
                    <div className="group-name-edit">
                      <input
                        type="text"
                        value={editingGroupName}
                        onChange={(e) => setEditingGroupName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveGroupName();
                          if (e.key === 'Escape') cancelEditingGroupName();
                        }}
                        onBlur={saveGroupName}
                        className="group-name-input"
                        placeholder="Nombre del grupo"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="group-name-display">
                      <h4>{group.name}</h4>
                      <button
                        onClick={() => startEditingGroupName(group)}
                        className="edit-name-btn"
                        title="Editar nombre del grupo"
                      >
                        <Edit size={14} />
                      </button>
                    </div>
                  )}
                  <span className="team-count">({group.teams.length} parejas)</span>
                </div>
                
                {/* Parejas asignadas */}
                <div className="assigned-teams">
                  {group.teams.map(team => (
                    <div key={team.id} className="team-item assigned">
                      <span>{team.name}</span>
                      <button
                        onClick={() => removeTeamFromGroup(team, group.id)}
                        className="remove-btn"
                        title="Remover del grupo"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Botones para agregar parejas */}
                {unassignedTeams.length > 0 && (
                  <div className="add-teams-section">
                    <p className="add-teams-label">Agregar pareja:</p>
                    <div className="add-team-buttons">
                      {unassignedTeams.map(team => (
                        <button
                          key={team.id}
                          onClick={() => addTeamToGroup(team, group.id)}
                          className="add-team-btn"
                        >
                          <Plus size={14} />
                          {team.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Advertencia si no hay suficientes equipos */}
                {group.teams.length < 2 && (
                  <p className="warning-text">
                    Minimo 2 parejas por grupo
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="setup-actions">
        <button
          onClick={createGroups}
          disabled={!canCreateGroups()}
          className="btn btn-primary btn-large"
        >
          <Users size={20} />
          Iniciar Torneo
        </button>
        
        {!canCreateGroups() && (
          <p className="warning-message">
            {unassignedTeams.length > 0 
              ? `Faltan ${unassignedTeams.length} parejas por asignar`
              : 'Cada grupo debe tener al menos 2 parejas'
            }
          </p>
        )}
        
        <div className="rules-info">
                      <h4>Reglas de Distribucion:</h4>
          <ul>
                          <li><strong>4-6 parejas:</strong> 1 grupo unico</li>
            <li><strong>7 parejas:</strong> 1 grupo de 4 + 1 grupo de 3</li>
            <li><strong>8 parejas:</strong> 2 grupos de 4</li>
            <li><strong>9 parejas:</strong> 1 grupo de 4 + 1 grupo de 5</li>
            <li><strong>10 parejas:</strong> 2 grupos de 5</li>
            <li><strong>11 parejas:</strong> 1 grupo de 5 + 1 grupo de 6</li>
            <li><strong>12 parejas:</strong> 3 grupos de 4</li>
            <li><strong>13 parejas:</strong> 2 grupos de 4 + 1 grupo de 5</li>
            <li><strong>14 parejas:</strong> 2 grupos de 4 + 2 grupos de 3</li>
            <li><strong>15 parejas:</strong> 3 grupos de 5</li>
            <li><strong>16 parejas:</strong> 4 grupos de 4</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
