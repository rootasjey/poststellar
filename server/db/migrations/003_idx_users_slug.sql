-- Create case-insensitive unique index for users.slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_slug ON users (slug COLLATE NOCASE);
