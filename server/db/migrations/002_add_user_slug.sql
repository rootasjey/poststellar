-- Add slug column to users and unique index (Cloudflare D1: one statement per file is a transaction)
ALTER TABLE users ADD COLUMN slug TEXT DEFAULT "";
