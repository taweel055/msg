import sqlite3 from 'sqlite3';

const dbPath = process.env.DATABASE_PATH || './database.sqlite';

export const db = new sqlite3.Database(dbPath);

// Promisified database methods
export const dbAsync = {
  run: (sql: string, params: any[] = []): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },
  get: <T = any>(sql: string, params: any[] = []): Promise<T | undefined> => {
    return new Promise<T | undefined>((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row as T | undefined);
      });
    });
  },
  all: <T = any>(sql: string, params: any[] = []): Promise<T[]> => {
    return new Promise<T[]>((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve((rows || []) as T[]);
      });
    });
  },
};

export async function initializeDatabase() {
  await dbAsync.run(`
    CREATE TABLE IF NOT EXISTS groups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      color TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbAsync.run(`
    CREATE TABLE IF NOT EXISTS screenshots (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      filepath TEXT NOT NULL,
      group_id TEXT,
      content_type TEXT DEFAULT 'screenshot',
      ocr_provider TEXT NOT NULL,
      extracted_text TEXT,
      summary TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
    )
  `);

  // Add content_type column if it doesn't exist (for existing databases)
  await dbAsync.run(`
    ALTER TABLE screenshots ADD COLUMN content_type TEXT DEFAULT 'screenshot'
  `).catch(() => {
    // Column already exists, ignore error
  });

  await dbAsync.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      screenshot_id TEXT,
      group_id TEXT,
      status TEXT DEFAULT 'pending',
      priority TEXT DEFAULT 'medium',
      due_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (screenshot_id) REFERENCES screenshots(id) ON DELETE CASCADE,
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
    )
  `);

  console.log('Database initialized successfully');
}
