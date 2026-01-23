
import React from 'react';
import { WordEntry, AppView } from '../types';

interface DashboardProps {
  words: WordEntry[];
  setView: (view: AppView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ words, setView }) => {
  const totalWords = words.length;
  const recentWords = words.slice(0, 5);

  const stats = [
    { label: '總單字量', value: totalWords, color: 'bg-blue-50 text-blue-600', icon: '📚' },
    { label: '今日進度', value: '80%', color: 'bg-green-50 text-green-600', icon: '🎯' },
    { label: '測驗次數', value: 12, color: 'bg-purple-50 text-purple-600', icon: '🔥' },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">歡迎回來！</h2>
        <p className="text-slate-500">今天也是學習新單字的好日子。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-800">快速開始</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setView('add')}
              className="flex flex-col items-center justify-center p-6 bg-blue-50 border border-blue-100 rounded-2xl hover:bg-blue-100 transition-colors group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">➕</span>
              <span className="font-semibold text-blue-700">新增單字</span>
            </button>
            <button 
              onClick={() => setView('quiz')}
              className="flex flex-col items-center justify-center p-6 bg-purple-50 border border-purple-100 rounded-2xl hover:bg-purple-100 transition-colors group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📝</span>
              <span className="font-semibold text-purple-700">進入測驗</span>
            </button>
            <button 
              onClick={() => setView('import')}
              className="flex flex-col items-center justify-center p-6 bg-orange-50 border border-orange-100 rounded-2xl hover:bg-orange-100 transition-colors group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📥</span>
              <span className="font-semibold text-orange-700">匯入 JSON</span>
            </button>
          </div>
        </div>

        {/* Recent Words */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">最近加入</h3>
            <button 
              onClick={() => setView('browse')}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              查看全部 →
            </button>
          </div>
          <div className="space-y-3">
            {recentWords.length > 0 ? (
              recentWords.map((word) => (
                <div key={word.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div>
                    <p className="font-bold text-slate-800">{word.word}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[200px]">
                      {word.meanings.map(m => `${m.pos} ${m.translation}`).join('、')}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(word.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-slate-400 italic">目前尚無單字，快去新增吧！</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
