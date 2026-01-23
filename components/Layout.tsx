
import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const navItems = [
    { id: 'dashboard' as AppView, label: '儀表板', icon: '📊' },
    { id: 'add' as AppView, label: '新增單字', icon: '➕' },
    { id: 'browse' as AppView, label: '瀏覽單字', icon: '📖' },
    { id: 'quiz' as AppView, label: '開始測驗', icon: '📝' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-6 space-y-8 sticky top-0 h-screen">
        <div className="flex items-center space-x-2">
          <span className="text-3xl">📘</span>
          <h1 className="text-xl font-bold text-slate-800">VocabMaster</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                currentView === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">© 2024 VocabMaster Pro</p>
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <header className="md:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📘</span>
            <h1 className="text-lg font-bold text-slate-800">VocabMaster</h1>
          </div>
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`p-2 rounded-lg transition-all ${
                  currentView === item.id ? 'bg-blue-100 text-blue-600' : 'text-slate-500'
                }`}
                title={item.label}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};
