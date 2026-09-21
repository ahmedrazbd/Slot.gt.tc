import initSqlJs, { Database } from 'sql.js';
import { Platform, Offer, ClickRecord, ChatMessage, SqlQueryResult, SqlTableSchema } from '../types';
import { RAW_PLATFORMS, RAW_OFFERS, RAW_CLICKS, RAW_MESSAGES } from '../data/databaseData';

let dbInstance: Database | null = null;
let initPromise: Promise<Database> | null = null;

// Helper to escape single quotes in SQL strings
function esc(str: string | undefined | null): string {
  if (str === null || str === undefined) return "''";
  return `'${String(str).replace(/'/g, "''")}'`;
}

export async function getSqlDb(): Promise<Database> {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const SQL = await initSqlJs({
        locateFile: (file) => `/${file}`,
      });

      const db = new SQL.Database();

      // Create schema
      db.run(`
        CREATE TABLE IF NOT EXISTS platforms (
          id INTEGER PRIMARY KEY,
          place INTEGER NOT NULL,
          name TEXT NOT NULL,
          logo TEXT NOT NULL,
          affiliated_by TEXT NOT NULL,
          badges TEXT NOT NULL,
          rating TEXT NOT NULL,
          rating_score REAL NOT NULL,
          cta_url TEXT NOT NULL,
          status TEXT NOT NULL,
          clicks_count INTEGER DEFAULT 0,
          description TEXT
        );

        CREATE TABLE IF NOT EXISTS offers (
          id INTEGER PRIMARY KEY,
          code TEXT NOT NULL,
          description TEXT NOT NULL,
          target_user_id TEXT NOT NULL,
          expires_at TEXT,
          created_at TEXT NOT NULL,
          active INTEGER DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS clicks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ref_code TEXT NOT NULL,
          clicks INTEGER DEFAULT 0,
          signups INTEGER DEFAULT 0,
          platforms_json TEXT,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY,
          from_id TEXT NOT NULL,
          to_id TEXT NOT NULL,
          content TEXT NOT NULL,
          is_admin INTEGER DEFAULT 0,
          is_read INTEGER DEFAULT 0,
          created_at TEXT NOT NULL
        );
      `);

      // Seed platforms
      db.run('BEGIN TRANSACTION;');
      for (const p of RAW_PLATFORMS) {
        db.run(`
          INSERT INTO platforms (id, place, name, logo, affiliated_by, badges, rating, rating_score, cta_url, status, clicks_count, description)
          VALUES (
            ${p.id},
            ${p.place},
            ${esc(p.name)},
            ${esc(p.logo)},
            ${esc(p.affiliatedBy)},
            ${esc(p.badges.join(','))},
            ${esc(p.rating)},
            ${p.ratingScore},
            ${esc(p.ctaUrl)},
            ${esc(p.status)},
            ${p.clicksCount},
            ${esc(p.description)}
          );
        `);
      }

      // Seed offers
      for (const o of RAW_OFFERS) {
        db.run(`
          INSERT INTO offers (id, code, description, target_user_id, expires_at, created_at, active)
          VALUES (
            ${o.id},
            ${esc(o.code)},
            ${esc(o.description)},
            ${esc(o.targetUserId)},
            ${esc(o.expiresAt)},
            ${esc(o.createdAt)},
            ${o.active ? 1 : 0}
          );
        `);
      }

      // Seed clicks
      for (const c of RAW_CLICKS) {
        db.run(`
          INSERT INTO clicks (ref_code, clicks, signups, platforms_json, updated_at)
          VALUES (
            ${esc(c.refCode)},
            ${c.clicks},
            ${c.signups},
            ${esc(JSON.stringify(c.platforms))},
            ${esc(c.updatedAt)}
          );
        `);
      }

      // Seed messages
      for (const m of RAW_MESSAGES) {
        db.run(`
          INSERT INTO messages (id, from_id, to_id, content, is_admin, is_read, created_at)
          VALUES (
            ${m.id},
            ${esc(m.fromId)},
            ${esc(m.toId)},
            ${esc(m.content)},
            ${m.isAdmin ? 1 : 0},
            ${m.isRead ? 1 : 0},
            ${esc(m.createdAt)}
          );
        `);
      }
      db.run('COMMIT;');

      dbInstance = db;
      return db;
    } catch (err) {
      console.error('Failed to initialize sql.js wasm:', err);
      throw err;
    }
  })();

  return initPromise;
}

export async function executeSqlQuery(sql: string): Promise<SqlQueryResult> {
  const startTime = performance.now();
  try {
    const db = await getSqlDb();
    const results = db.exec(sql);
    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

    if (!results || results.length === 0) {
      return {
        columns: ['status'],
        values: [['Query executed successfully. (0 rows returned)']],
        rowCount: 0,
        executionTimeMs,
        rawQuery: sql,
      };
    }

    const firstResult = results[0];
    return {
      columns: firstResult.columns,
      values: firstResult.values,
      rowCount: firstResult.values.length,
      executionTimeMs,
      rawQuery: sql,
    };
  } catch (error: any) {
    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
    return {
      columns: ['Error'],
      values: [[error?.message || String(error)]],
      rowCount: 0,
      executionTimeMs,
      error: error?.message || String(error),
      rawQuery: sql,
    };
  }
}

export async function getSqlTableSchemas(): Promise<SqlTableSchema[]> {
  try {
    const db = await getSqlDb();
    const tablesRes = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
    if (!tablesRes || tablesRes.length === 0) return [];

    const tables: SqlTableSchema[] = [];
    for (const row of tablesRes[0].values) {
      const tableName = row[0] as string;
      const countRes = db.exec(`SELECT COUNT(*) FROM "${tableName}";`);
      const rowCount = (countRes[0]?.values[0]?.[0] as number) || 0;

      const colsRes = db.exec(`PRAGMA table_info("${tableName}");`);
      const columns = (colsRes[0]?.values || []).map((col) => ({
        name: col[1] as string,
        type: col[2] as string,
        pk: Boolean(col[5]),
      }));

      tables.push({
        name: tableName,
        rowCount,
        columns,
      });
    }

    return tables;
  } catch (err) {
    console.error('Failed to get SQL table schemas:', err);
    return [
      {
        name: 'platforms',
        rowCount: 47,
        columns: [
          { name: 'id', type: 'INTEGER', pk: true },
          { name: 'place', type: 'INTEGER' },
          { name: 'name', type: 'TEXT' },
          { name: 'logo', type: 'TEXT' },
          { name: 'affiliated_by', type: 'TEXT' },
          { name: 'badges', type: 'TEXT' },
          { name: 'rating', type: 'TEXT' },
          { name: 'rating_score', type: 'REAL' },
          { name: 'cta_url', type: 'TEXT' },
          { name: 'status', type: 'TEXT' },
          { name: 'clicks_count', type: 'INTEGER' },
          { name: 'description', type: 'TEXT' },
        ],
      },
      {
        name: 'offers',
        rowCount: 4,
        columns: [
          { name: 'id', type: 'INTEGER', pk: true },
          { name: 'code', type: 'TEXT' },
          { name: 'description', type: 'TEXT' },
          { name: 'target_user_id', type: 'TEXT' },
          { name: 'expires_at', type: 'TEXT' },
          { name: 'created_at', type: 'TEXT' },
          { name: 'active', type: 'INTEGER' },
        ],
      },
      {
        name: 'clicks',
        rowCount: 1,
        columns: [
          { name: 'id', type: 'INTEGER', pk: true },
          { name: 'ref_code', type: 'TEXT' },
          { name: 'clicks', type: 'INTEGER' },
          { name: 'signups', type: 'INTEGER' },
          { name: 'platforms_json', type: 'TEXT' },
          { name: 'updated_at', type: 'TEXT' },
        ],
      },
      {
        name: 'messages',
        rowCount: 3,
        columns: [
          { name: 'id', type: 'INTEGER', pk: true },
          { name: 'from_id', type: 'TEXT' },
          { name: 'to_id', type: 'TEXT' },
          { name: 'content', type: 'TEXT' },
          { name: 'is_admin', type: 'INTEGER' },
          { name: 'is_read', type: 'INTEGER' },
          { name: 'created_at', type: 'TEXT' },
        ],
      },
    ];
  }
}

export async function exportSqlDump(): Promise<string> {
  try {
    const db = await getSqlDb();
    let dump = `-- Trending Slot Bd Relational SQL Database Backup\n`;
    dump += `-- Generated on: ${new Date().toISOString()}\n`;
    dump += `-- SQLite Schema & Data Dump\n\n`;

    const tables = ['platforms', 'offers', 'clicks', 'messages'];
    for (const table of tables) {
      dump += `-- Table: ${table}\n`;
      const createRes = db.exec(`SELECT sql FROM sqlite_master WHERE type='table' AND name='${table}';`);
      if (createRes && createRes.length > 0 && createRes[0].values.length > 0) {
        dump += `${createRes[0].values[0][0]};\n\n`;
      }

      const rowsRes = db.exec(`SELECT * FROM "${table}";`);
      if (rowsRes && rowsRes.length > 0) {
        const cols = rowsRes[0].columns;
        for (const valRow of rowsRes[0].values) {
          const valStrings = valRow.map((v) => {
            if (v === null || v === undefined) return 'NULL';
            if (typeof v === 'number') return v;
            return `'${String(v).replace(/'/g, "''")}'`;
          });
          dump += `INSERT INTO "${table}" (${cols.map((c) => `"${c}"`).join(', ')}) VALUES (${valStrings.join(', ')});\n`;
        }
        dump += `\n`;
      }
    }
    return dump;
  } catch (err: any) {
    return `-- Export failed: ${err?.message}`;
  }
}
