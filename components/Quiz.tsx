
import React, { useState, useMemo } from 'react';
import { WordEntry } from '../types';

interface QuizProps {
  words: WordEntry[];
  onBack: () => void;
}

type QuizState = 'setup' | 'active' | 'finished';

export const Quiz: React.FC<QuizProps> = ({ words, onBack }) => {
  const [gameState, setGameState] = useState<QuizState>('setup');
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [quizWords, setQuizWords] = useState<WordEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [count, setCount] = useState(10);

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  const toggleLetter = (l: string) => {
    setSelectedLetters(prev => 
      prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]
    );
  };

  const startQuiz = () => {
    let pool = words;
    if (selectedLetters.length > 0) {
      pool = words.filter(w => selectedLetters.includes(w.word[0].toLowerCase()));
    }

    if (pool.length === 0) {
      alert('選擇的字母範圍內沒有單字！');
      return;
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setQuizWords(shuffled.slice(0, count));
    setGameState('active');
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const nextWord = () => {
    if (currentIndex < quizWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setGameState('finished');
    }
  };

  if (gameState === 'setup') {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">單字測驗設定</h2>
          <p className="text-slate-500">選擇你想練習的字母範圍與題數</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700">選擇開頭字母 (不選則包含全部)</label>
              <button 
                onClick={() => setSelectedLetters([])} 
                className="text-xs text-blue-600 hover:underline"
              >
                清除全部
              </button>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
              {alphabet.map(l => (
                <button
                  key={l}
                  onClick={() => toggleLetter(l)}
                  className={`aspect-square flex items-center justify-center rounded-lg border text-sm font-bold transition-all ${
                    selectedLetters.includes(l)
                      ? 'bg-blue-600 border-blue-600 text-white scale-110'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">測驗題數</label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="5"
                max={Math.max(5, words.length)}
                step="5"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="w-12 text-center font-bold text-blue-600 bg-blue-50 py-1 rounded-lg border border-blue-100">
                {count}
              </span>
            </div>
          </div>

          <div className="pt-4 flex space-x-4">
            <button
              onClick={onBack}
              className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
            >
              返回
            </button>
            <button
              onClick={startQuiz}
              disabled={words.length === 0}
              className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-100"
            >
              開始測驗
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'active' && quizWords.length > 0) {
    const current = quizWords[currentIndex];
    const progress = ((currentIndex + 1) / quizWords.length) * 100;

    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-slate-400 font-medium px-2">
            <span>題號 {currentIndex + 1} / {quizWords.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white min-h-[400px] p-12 rounded-3xl border border-slate-100 shadow-xl flex flex-col items-center justify-center text-center space-y-12 relative overflow-hidden">
          {/* Card background decorations */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-blue-50 rounded-br-full -z-10 opacity-50" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-50 rounded-tl-full -z-10 opacity-50" />

          <div className="space-y-4">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em]">Vocabulary</p>
            <h3 className="text-5xl font-black text-slate-800 tracking-tight">{current.word}</h3>
          </div>

          <div className={`transition-all duration-500 w-full ${showAnswer ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <div className="space-y-4 inline-block text-left p-6 bg-slate-50 rounded-2xl border border-slate-100 w-full max-w-sm">
              {current.meanings.map((m, i) => (
                <div key={i} className="flex items-baseline space-x-3">
                  <span className="text-xs font-bold text-white bg-blue-500 px-2 py-0.5 rounded uppercase shrink-0">
                    {m.pos}
                  </span>
                  <span className="text-xl font-medium text-slate-700">{m.translation}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full pt-8">
            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full py-5 bg-slate-800 text-white rounded-2xl font-bold text-lg hover:bg-slate-900 transition-all shadow-xl"
              >
                顯示答案
              </button>
            ) : (
              <button
                onClick={nextWord}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl animate-in fade-in zoom-in-95"
              >
                {currentIndex === quizWords.length - 1 ? '查看結果' : '下一題'}
              </button>
            )}
          </div>
        </div>

        <button 
          onClick={() => { if(confirm('確定要結束測驗嗎？')) setGameState('setup') }}
          className="w-full text-slate-400 hover:text-slate-600 font-medium transition-colors"
        >
          放棄並結束測驗
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-12 text-center space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="space-y-4">
        <span className="text-8xl">🏆</span>
        <h2 className="text-4xl font-bold text-slate-800">恭喜完成！</h2>
        <p className="text-slate-500 text-lg">你已經完成了本次的 {quizWords.length} 個單字複習。</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-2xl">
          <p className="text-xs text-blue-600 font-bold uppercase mb-1">總複習數</p>
          <p className="text-3xl font-black text-blue-900">{quizWords.length}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-2xl">
          <p className="text-xs text-green-600 font-bold uppercase mb-1">完成率</p>
          <p className="text-3xl font-black text-green-900">100%</p>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setGameState('setup')}
          className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200"
        >
          重新開始
        </button>
        <button
          onClick={onBack}
          className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100"
        >
          回到主選單
        </button>
      </div>
    </div>
  );
};
