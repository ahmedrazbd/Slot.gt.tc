import React, { useState, useEffect } from 'react';
import {
  Database,
  Play,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Table as TableIcon,
  Clock,
  Sparkles,
  Terminal,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';
import { executeSqlQuery, getSqlTableSchemas, exportSqlDump } from '../services/sqlDatabase';
import { SqlQueryResult, SqlTableSchema } from '../types';

const PRESET_QUERIES = [
  {
    name: 'Top 10 Ranked Platforms',
    sql: `SELECT place, name, rating, rating_score, affiliated_by, badges \nFROM platforms \nORDER BY place ASC \nLIMIT 10;`,
  },
  {
    name: 'Group by Affiliate & Count',
    sql: `SELECT affiliated_by, COUNT(*) AS total_platforms, ROUND(AVG(rating_score), 2) AS avg_rating \nFROM platforms \nGROUP BY affiliated_by \nORDER BY total_platforms DESC;`,
  },
  {
    name: 'Instant Payout High Ratings (>=4.5)',
    sql: `SELECT place, name, rating_score, badges, cta_url \nFROM platforms \nWHERE badges LIKE '%Instant-Pay%' AND rating_score >= 4.5 \nORDER BY rating_score DESC;`,
  },
  {
    name: 'Active Promo Vouchers',
    sql: `SELECT id, code, description, expires_at, active \nFROM offers \nWHERE active = 1;`,
  },
  {
    name: 'Referral Clicks Telemetry',
    sql: `SELECT ref_code, clicks, signups, updated_at \nFROM clicks;`,
  },
  {
    name: 'Direct Support Messages',
    sql: `SELECT id, from_id, to_id, content, is_admin, created_at \nFROM messages \nORDER BY id DESC;`,
  },
];

export const SqlStudioView: React.FC = () => {
  const [query, setQuery] = useState(PRESET_QUERIES[0].sql);
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryResult, setQueryResult] = useState<SqlQueryResult | null>(null);
  const [tables, setTables] = useState<SqlTableSchema[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('platforms');
  const [copiedDump, setCopiedDump] = useState(false);
  const [copiedCell, setCopiedCell] = useState<string | null>(null);

  // Load table schemas on mount
  useEffect(() => {
    loadSchemas();
    runQuery(PRESET_QUERIES[0].sql);
  }, []);

  const loadSchemas = async () => {
    try {
      const schemaList = await getSqlTableSchemas();
      setTables(schemaList);
    } catch (err) {
      console.error(err);
    }
  };

  const runQuery = async (sqlToRun?: string) => {
    const targetSql = sqlToRun || query;
    if (!targetSql.trim()) return;

    setIsExecuting(true);
    try {
      const result = await executeSqlQuery(targetSql);
      setQueryResult(result);
      loadSchemas();
    } catch (error: any) {
      setQueryResult({
        columns: ['Error'],
        values: [[error.message || String(error)]],
        rowCount: 0,
        executionTimeMs: 0,
        error: error.message || String(error),
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleExportSql = async () => {
    const dump = await exportSqlDump();
    const blob = new Blob([dump], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trending-slot-bd-database-${new Date().toISOString().slice(0, 10)}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setCopiedDump(true);
    setTimeout(() => setCopiedDump(false), 2500);
  };

  const handleCopyCell = (val: any) => {
    const text = String(val ?? '');
    navigator.clipboard.writeText(text);
    setCopiedCell(text);
    setTimeout(() => setCopiedCell(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                SQLite Relational Engine Active
              </span>
              <span className="text-xs text-slate-400 font-mono">
                WASM SQLite v3.x
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Database className="w-7 h-7 text-emerald-400" />
              Relational SQL Database Studio
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Direct SQL query console connected to your real database. Query all 47 gaming portals, promo vouchers, telemetry clicks, and user messages with native SQL syntax.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportSql}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition shadow-sm hover:border-slate-600"
            >
              {copiedDump ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Dump Exported!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Export .SQL Dump</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Query Console & Tables Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Top: Query Console (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Query Presets Chips */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Quick SQL Presets
              </span>
              <span className="text-[11px] text-slate-400">Click to load</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_QUERIES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(preset.sql);
                    runQuery(preset.sql);
                  }}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 hover:border-emerald-500/40 transition font-medium text-left"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* SQL Editor Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 font-mono text-slate-400">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>SQL Query Editor</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => runQuery()}
                  disabled={isExecuting}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 fill-slate-950 ${isExecuting ? 'animate-spin' : ''}`} />
                  {isExecuting ? 'Executing...' : 'Run Query (⌘↵)'}
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#090d16]">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    e.preventDefault();
                    runQuery();
                  }
                }}
                rows={5}
                className="w-full bg-transparent font-mono text-xs md:text-sm text-emerald-300 placeholder-slate-600 focus:outline-hidden resize-y leading-relaxed"
                placeholder="Enter SQL (e.g. SELECT * FROM platforms WHERE rating_score > 4.0;)"
                spellCheck={false}
              />
            </div>

            {/* Execution status footer */}
            <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-3">
                {queryResult && (
                  <>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {queryResult.executionTimeMs} ms
                    </span>
                    <span>•</span>
                    <span>{queryResult.rowCount} rows returned</span>
                  </>
                )}
              </div>
              <span>Supports SELECT, INSERT, UPDATE, DELETE, GROUP BY, JOIN</span>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Query Results
                </span>
              </div>
              {queryResult?.rowCount !== undefined && (
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {queryResult.rowCount} Records
                </span>
              )}
            </div>

            {queryResult?.error ? (
              <div className="p-6 bg-rose-950/20 text-rose-300 border-l-4 border-rose-500 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">SQL Syntax or Execution Error</p>
                  <p className="text-xs font-mono mt-1 text-rose-200/90">{queryResult.error}</p>
                </div>
              </div>
            ) : queryResult?.columns && queryResult.columns.length > 0 ? (
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-950 text-slate-300 border-b border-slate-800 font-mono text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-slate-500">#</th>
                      {queryResult.columns.map((col, i) => (
                        <th key={i} className="py-2.5 px-3 font-bold text-slate-200">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                    {queryResult.values.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-slate-800/40 transition">
                        <td className="py-2 px-3 text-slate-600 text-[10px]">{rowIdx + 1}</td>
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            onClick={() => handleCopyCell(cell)}
                            title="Click to copy cell"
                            className="py-2 px-3 whitespace-nowrap cursor-pointer hover:text-emerald-400 transition"
                          >
                            {cell === null ? (
                              <span className="text-slate-600 italic">NULL</span>
                            ) : typeof cell === 'object' ? (
                              JSON.stringify(cell)
                            ) : (
                              String(cell)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 text-xs">
                No query executed yet. Run a preset or custom query above.
              </div>
            )}
          </div>
        </div>

        {/* Right / Sidebar: Schema Inspector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                  Database Tables
                </h2>
              </div>
              <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                {tables.length} Tables
              </span>
            </div>

            {/* Table Selection Pills */}
            <div className="space-y-2">
              {tables.map((tbl) => (
                <div
                  key={tbl.name}
                  onClick={() => {
                    setSelectedTable(tbl.name);
                    const q = `SELECT * FROM ${tbl.name} LIMIT 20;`;
                    setQuery(q);
                    runQuery(q);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    selectedTable === tbl.name
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs flex items-center gap-1.5">
                      <TableIcon className="w-3.5 h-3.5 text-emerald-400" />
                      {tbl.name}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-800/80 px-2 py-0.5 rounded-full text-slate-400">
                      {tbl.rowCount} rows
                    </span>
                  </div>

                  {/* Columns preview */}
                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex flex-wrap gap-1">
                    {tbl.columns.map((col) => (
                      <span
                        key={col.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuery((prev) => `${prev} ${col.name}`);
                        }}
                        title={`Type: ${col.type}${col.pk ? ' (Primary Key)' : ''}`}
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                          col.pk
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {col.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* SQL Capabilities Note */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
              <div className="font-bold text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Live SQL Sync
              </div>
              <p className="leading-relaxed">
                Queries directly read and write to the relational database in memory. You can run <code className="text-emerald-300">UPDATE platforms SET rating_score = 5.0 WHERE id = 1;</code> to test edits in real time!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
