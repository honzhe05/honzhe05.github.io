
import React, { useState } from 'react';
import { WordEntry, Meaning, POS_OPTIONS } from '../types';

interface AddWordProps {
  onAdd: (entry: Omit<WordEntry, 'id' | 'createdAt'>) => void;
  onBack: () => void;
  words: WordEntry[];
}

export const AddWord: React.FC<AddWordProps> = ({ onAdd, onBack, words }) => {
  const [word, setWord] = useState('');
  const [meanings, setMeanings] = useState<Meaning[]>([{ pos: POS_OPTIONS[0], translation: '' }]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddMeaning = () => {
    setMeanings([...meanings, { pos: POS_OPTIONS[0], translation: '' }]);
  };

  const handleRemoveMeaning = (index: number) => {
    if (meanings.length > 1) {
      setMeanings(meanings.filter((_, i) => i !== index));
    }
  };

  const handleMeaningChange = (index: number, field: keyof Meaning, value: string) => {
    const updated = meanings.map((m, i) => i === index ? { ...m, [field]: value } : m);
    setMeanings(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedWord = word.trim();
    if (!trimmedWord) {
      setError('請輸入單字');
      return;
    }

    if (!/^[a-zA-Z\s-]+$/.test(trimmedWord)) {
      setError('請輸入正確的英文單字');
      return;
    }

    if (words.some(w => w.word.toLowerCase() === trimmedWord.toLowerCase())) {
      setError('此單字已經存在於系統中');
      return;
    }

    if (meanings.some(m => !m.translation.trim())) {
      setError('請為所有詞性填寫中文意思');
      return;
    }

    onAdd({
      word: trimmedWord,
      meanings: meanings.map(m => ({ ...m, translation: m.translation.trim() }))
    });

    setSuccess(`已成功新增單字：${trimmedWord}`);
    setWord('');
    setMeanings([{ pos: POS_OPTIONS[0], translation: '' }]);
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">新增單字</h2>
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 transition-colors">
          關閉
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
        {/* Word Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">英文單字</label>
          <input
            autoFocus
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="例如: ambitious"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-lg font-medium"
          />
        </div>

        {/* Meanings Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-700">詞性與中文翻譯</label>
            <button
              type="button"
              onClick={handleAddMeaning}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
            >
              + 新增詞性
            </button>
          </div>

          <div className="space-y-4">
            {meanings.map((m, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 rounded-2xl relative group">
                <select
                  value={m.pos}
                  onChange={(e) => handleMeaningChange(index, 'pos', e.target.value)}
                  className="w-full sm:w-32 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                >
                  {POS_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={m.translation}
                  onChange={(e) => handleMeaningChange(index, 'translation', e.target.value)}
                  placeholder="中文意思"
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                {meanings.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMeaning(index)}
                    className="sm:absolute -right-3 -top-3 w-7 h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium animate-bounce">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm font-medium">
            ✅ {success}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-100"
        >
          新增至單字本
        </button>
      </form>
    </div>
  );
};
