PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  repository_url TEXT,
  deployment_url TEXT,
  status TEXT NOT NULL DEFAULT 'created'
    CHECK (status IN ('created', 'building', 'deployed', 'failed', 'paused')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_projects_created_at
  ON projects(created_at DESC);
