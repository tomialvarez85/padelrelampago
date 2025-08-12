import { useState, useEffect } from 'react';
import { TournamentService } from './services/tournamentService';
import type { Tournament } from './types';
import TournamentList from './components/TournamentList';
import CreateTournament from './components/CreateTournament';
import TournamentView from './components/TournamentView';
import './App.css';

type View = 'list' | 'create' | 'tournament';

function App() {
  const [view, setView] = useState<View>('list');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

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

  const handleTournamentCreated = () => {
    loadTournaments();
    setView('list');
  };

  const handleTournamentSelected = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setView('tournament');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedTournament(null);
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
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏓 Pádel Relámpago</h1>
        <p>Sistema de Gestión de Torneos</p>
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
