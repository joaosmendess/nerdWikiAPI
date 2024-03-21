import sqlite3 from "better-sqlite3";

interface Database {
  prepare: (query: string) => any;
  // Adicione mais métodos conforme necessário
}

export const db: Database = new sqlite3("app.db") as unknown as Database;
