
import React, { useState, useMemo } from 'react';
import { WordEntry } from '../types';

interface BrowseWordsProps {
  words: WordEntry[];
  onDelete: (id: string) => void;
  onUpdate: (word: WordEntry) => void;
}

export const BrowseWords: React.FC<BrowseWordsProps> = ({ words, onDelete, onUpdate }) => {
  const [search, setSearch] = useState('');
  const [filterLetter, setFilterLetter] = useState<string | null>(null);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const filteredWords = useMemo(() => {
    return words.filter(w => {
      const matchesSearch = w.word.toLowerCase().includes(search.toLowerCase()) || 
                          w.meanings.some(m => m.translation.includes(search));
      const matchesLetter = filterLetter ? w.word.toLowerCase().startsWith(filterLetter.toLowerCase()) : true;
      return matchesSearch && matchesLetter;
    });
  }, [words, search, filterLetter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">瀏覽單字</h2>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜尋單字或中文意思..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>
      </div>

      {/* Alphabet Filter */}
      <div className="flex flex-wrap gap-1 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <button
          onClick={() => setFilterLetter(null)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            filterLetter === null ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          All
        </button>
        {alphabet.map(l => (
          <button
            key={l}
            onClick={() => setFilterLetter(l === filterLetter ? null : l)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filterLetter === l ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWords.length > 0 ? (
          filteredWords.map((word) => (
            <div key={word.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm group hover:border-blue-200 transition-all flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-slate-800">{word.word}</h3>
                  <span className="text-xs text-slate-400 font-normal">
                    {new Date(word.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="space-y-1">
                  {word.meanings.map((m, i) => (
                    <div key={i} className="flex items-baseline space-x-2">
                      <span className="text-xs font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded uppercase">
                        {m.pos}
                      </span>
                      <span className="text-sm text-slate-600">{m.translation}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => {
                  if (confirm(`確定要刪除 "${word.word}" 嗎？`)) {
                    onDelete(word.id);
                  }
                }}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="刪除"
              >
                🗑️
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <span className="text-6xl">📭</span>
            <p className="text-slate-400 font-medium">找不到符合條件的單字</p>
          </div>
        )}
      </div>
    </div>
  );
};
