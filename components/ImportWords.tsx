
import React, { useState, useRef } from 'react';
import { WordEntry, POS_OPTIONS, Meaning } from '../types';

interface ImportWordsProps {
  onImport: (newWords: Omit<WordEntry, 'id' | 'createdAt'>[]) => void;
  onBack: () => void;
}

export const ImportWords: React.FC<ImportWordsProps> = ({ onImport, onBack }) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseName = (name: string): Meaning[] => {
    // Expected format: "v. 勸告" or "v. 勸告、n. 建議"
    const parts = name.split('、');
    return parts.map(part => {
      let foundPos = 'n.[C]'; // Default if no POS prefix is found
      let translation = part.trim();

      // Find if any POS option matches the start of the part
      for (const pos of POS_OPTIONS) {
        if (part.trim().startsWith(pos)) {
          foundPos = pos;
          translation = part.trim().substring(pos.length).trim();
          break;
        }
      }
      return { pos: foundPos, translation };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setJsonText(text);
      setError('');
    };
    reader.onerror = () => {
      setError('讀取檔案時發生錯誤');
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    setError('');
    setSummary('');
    try {
      if (!jsonText.trim()) {
        throw new Error('請貼上 JSON 內容或選擇檔案');
      }

      const data = JSON.parse(jsonText);
      if (!Array.isArray(data)) {
        throw new Error('JSON 格式必須是陣列');
      }

      const parsed: Omit<WordEntry, 'id' | 'createdAt'>[] = data.map((item: any, index: number) => {
        if (!item.word || !item.name) {
          throw new Error(`第 ${index + 1} 個項目格式錯誤（必須包含 word 與 name）`);
        }
        return {
          word: item.word,
          meanings: parseName(item.name)
        };
      });

      onImport(parsed);
      setSummary(`成功匯入 ${parsed.length} 個單字！`);
      setJsonText('');
      setTimeout(() => onBack(), 1500);
    } catch (e: any) {
      setError(`匯入失敗: ${e.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">📥</span>
          <h2 className="text-2xl font-bold text-slate-800">匯入單字本</h2>
        </div>
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 transition-colors">
          關閉
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
        {/* File Upload Area */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer group"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            className="hidden" 
          />
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📄</div>
          <p className="font-bold text-slate-700">選擇 JSON 檔案</p>
          <p className="text-sm text-slate-400 mt-1">或是直接在下方貼上 JSON 內容</p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-400 font-medium">OR</span>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="block text-sm font-semibold text-slate-700">JSON 內容</label>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Standard Format</span>
          </div>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='[ {"word": "advice", "name": "v. 勸告"} ]'
            className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-xs leading-relaxed"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center space-x-2 animate-in slide-in-from-top-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {summary && (
          <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm font-medium border border-green-100 flex items-center space-x-2 animate-in fade-in">
            <span>✅</span>
            <span>{summary}</span>
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={!jsonText.trim()}
          className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg hover:bg-orange-700 active:scale-[0.98] disabled:bg-slate-300 disabled:active:scale-100 transition-all shadow-lg shadow-orange-100"
        >
          開始匯入單字
        </button>

        <div className="pt-4 p-4 bg-slate-50 rounded-xl space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">匯入規則提示：</p>
          <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
            <li>JSON 必須是物件陣列格式</li>
            <li>每個物件需包含 "word" (英文) 與 "name" (中文)</li>
            <li>"name" 可包含多個詞性，以「、」分隔，如："v. 勸告、n. 建議"</li>
            <li>重複的單字將會自動過濾跳過</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
