-- Initial schema migrated from server/database/migrations/schema.sql
CREATE TABLE IF NOT EXISTS users (
  avatar TEXT DEFAULT "",
  biography TEXT DEFAULT "",
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  email_verified BOOLEAN DEFAULT FALSE,
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job TEXT DEFAULT "",
  language TEXT DEFAULT "en" CHECK (language IN ('en', 'fr', 'es', 'de', 'it')),
  last_login_at DATETIME,
  location TEXT DEFAULT "",
  name TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  socials TEXT DEFAULT "[]" CHECK (json_valid(socials)),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_name ON users (name);

CREATE TRIGGER IF NOT EXISTS update_users_timestamp
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
  UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  blob_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  image_alt TEXT,
  image_ext TEXT,
  image_src TEXT,
  language TEXT DEFAULT "en" CHECK (language IN ('en', 'fr', 'es', 'de', 'it')),
  links TEXT DEFAULT "{}" CHECK (json_valid(links)),
  metrics_comments INTEGER DEFAULT 0 CHECK (metrics_comments >= 0),
  metrics_likes INTEGER DEFAULT 0 CHECK (metrics_likes >= 0),
  metrics_views INTEGER DEFAULT 0 CHECK (metrics_views >= 0),
  name TEXT NOT NULL,
  published_at DATETIME,
  slug TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_unique_slug ON posts (slug);

CREATE TRIGGER IF NOT EXISTS update_posts_timestamp
AFTER UPDATE ON posts
FOR EACH ROW
BEGIN
  UPDATE posts SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE COLLATE NOCASE,
  category TEXT DEFAULT 'general',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER IF NOT EXISTS update_tags_timestamp
AFTER UPDATE ON tags
FOR EACH ROW
BEGIN
  UPDATE tags SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TABLE IF NOT EXISTS post_tags (
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_address TEXT,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  read BOOLEAN DEFAULT FALSE,
  sender_email TEXT NOT NULL,
  spam BOOLEAN DEFAULT FALSE,
  subject TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_messages_read_created_at ON messages(read, created_at DESC);

CREATE TRIGGER IF NOT EXISTS update_messages_timestamp
AFTER UPDATE ON messages
FOR EACH ROW
BEGIN
  UPDATE messages SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
