import { useState, useEffect } from 'react';
import { TournamentService } from './services/tournamentService';
import type { Tournament, Group } from './types';
import TournamentList from './components/TournamentList';
import CreateTournament from './components/CreateTournament';
import ManualGroupSetup from './components/ManualGroupSetup';
import TournamentView from './components/TournamentView';
import './App.css';

type View = 'list' | 'create' | 'setup-groups' | 'tournament';

function App() {
  const [view, setView] = useState<View>('list');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [tournamentForGroupSetup, setTournamentForGroupSetup] = useState<Tournament | null>(null);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = () => {
    const storedTournaments = TournamentService.getTournaments();
    setTournaments(storedTournaments);
  };

  const handleCreateTournament = () => {
    setView('create');
  };

  const handleTournamentCreated = (tournamentId: string) => {
    loadTournaments();
    const tournament = TournamentService.getTournament(tournamentId);
    if (tournament) {
      setTournamentForGroupSetup(tournament);
      setView('setup-groups');
    }
  };

  const handleTournamentSelected = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setView('tournament');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedTournament(null);
    setTournamentForGroupSetup(null);
  };

  const handleTournamentUpdated = () => {
    if (selectedTournament) {
      const updated = TournamentService.getTournament(selectedTournament.id);
      if (updated) {
        setSelectedTournament(updated);
      }
    }
    loadTournaments();
  };

  const handleDeleteTournament = (tournamentId: string) => {
    TournamentService.deleteTournament(tournamentId);
    loadTournaments();
    if (selectedTournament?.id === tournamentId) {
      setSelectedTournament(null);
      setView('list');
    }
    if (tournamentForGroupSetup?.id === tournamentId) {
      setTournamentForGroupSetup(null);
      setView('list');
    }
  };

  const handleGroupsCreated = (groups: Group[]) => {
    if (tournamentForGroupSetup) {
      TournamentService.startTournamentWithManualGroups(tournamentForGroupSetup.id, groups);
      loadTournaments();
      const updatedTournament = TournamentService.getTournament(tournamentForGroupSetup.id);
      if (updatedTournament) {
        setSelectedTournament(updatedTournament);
        setView('tournament');
      }
      setTournamentForGroupSetup(null);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏓 Padel Relampago</h1>
        <p>Sistema de Gestion de Torneos</p>
      </header>

      <main className="app-main">
        {view === 'list' && (
          <TournamentList
            tournaments={tournaments}
            onCreateTournament={handleCreateTournament}
            onSelectTournament={handleTournamentSelected}
            onDeleteTournament={handleDeleteTournament}
          />
        )}

        {view === 'create' && (
          <CreateTournament
            onTournamentCreated={handleTournamentCreated}
            onBack={handleBackToList}
          />
        )}

        {view === 'setup-groups' && tournamentForGroupSetup && (
          <ManualGroupSetup
            teams={tournamentForGroupSetup.teams}
            onGroupsCreated={handleGroupsCreated}
            onBack={handleBackToList}
          />
        )}

        {view === 'tournament' && selectedTournament && (
          <TournamentView
            tournament={selectedTournament}
            onBack={handleBackToList}
            onTournamentUpdated={handleTournamentUpdated}
          />
        )}
      </main>
    </div>
  );
}

export default App;
