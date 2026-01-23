
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AddWord } from './components/AddWord';
import { BrowseWords } from './components/BrowseWords';
import { Quiz } from './components/Quiz';
import { ImportWords } from './components/ImportWords';
import { WordEntry, AppView } from './types';

const STORAGE_KEY = 'vocab_master_words';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [words, setWords] = useState<WordEntry[]>([]);

  // Load words from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setWords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved words", e);
        setWords([]);
      }
    }
  }, []);

  // Save words whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  }, [words]);

  const handleAddWord = (entry: Omit<WordEntry, 'id' | 'createdAt'>) => {
    const newEntry: WordEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    setWords(prev => [newEntry, ...prev]);
  };

  const handleBulkImport = (newWords: Omit<WordEntry, 'id' | 'createdAt'>[]) => {
    const entries: WordEntry[] = newWords.map(w => ({
      ...w,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    }));
    // Filter out exact duplicates by word (case insensitive)
    setWords(prev => {
      const existingMap = new Map(prev.map(w => [w.word.toLowerCase(), w]));
      const toAdd = entries.filter(e => !existingMap.has(e.word.toLowerCase()));
      return [...toAdd, ...prev];
    });
  };

  const handleDeleteWord = (id: string) => {
    setWords(prev => prev.filter(w => w.id !== id));
  };

  const handleUpdateWord = (updatedWord: WordEntry) => {
    setWords(prev => prev.map(w => w.id === updatedWord.id ? updatedWord : w));
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard words={words} setView={setView} />;
      case 'add':
        return <AddWord onAdd={handleAddWord} onBack={() => setView('dashboard')} words={words} />;
      case 'browse':
        return (
          <BrowseWords 
            words={words} 
            onDelete={handleDeleteWord} 
            onUpdate={handleUpdateWord}
          />
        );
      case 'quiz':
        return <Quiz words={words} onBack={() => setView('dashboard')} />;
      case 'import':
        return <ImportWords onImport={handleBulkImport} onBack={() => setView('dashboard')} />;
      default:
        return <Dashboard words={words} setView={setView} />;
    }
  };

  return (
    <Layout currentView={view} setView={setView}>
      {renderView()}
    </Layout>
  );
};

export default App;
