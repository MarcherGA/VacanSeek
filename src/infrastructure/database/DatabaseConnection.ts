import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

/**
 * Manages SQLite database connection and schema initialization
 */
export class DatabaseConnection {
  private constructor(private db: Database.Database) {}

  static initialize(dbPath: string): DatabaseConnection {
    // Ensure directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created DB directory: ${dir}`);
    }

    // Now safe to open DB
    const db = new Database(dbPath);

    // Initialize schema
    db.exec(`
      CREATE TABLE IF NOT EXISTS sent_jobs (
        id TEXT PRIMARY KEY,
        site TEXT NOT NULL,
        title TEXT,
        url TEXT,
        company TEXT,
        text TEXT,
        posted_at TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    return new DatabaseConnection(db);
  }

  getDatabase(): Database.Database {
    return this.db;
  }

  close(): void {
    this.db.close();
  }
}
