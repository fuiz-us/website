CREATE TABLE IF NOT EXISTS "accounts" (
    "id" text NOT NULL,
    "userId" text NOT NULL DEFAULT NULL,
    "type" text NOT NULL DEFAULT NULL,
    "provider" text NOT NULL DEFAULT NULL,
    "providerAccountId" text NOT NULL DEFAULT NULL,
    "refresh_token" text DEFAULT NULL,
    "access_token" text DEFAULT NULL,
    "expires_at" number DEFAULT NULL,
    "token_type" text DEFAULT NULL,
    "scope" text DEFAULT NULL,
    "id_token" text DEFAULT NULL,
    "session_state" text DEFAULT NULL,
    "oauth_token_secret" text DEFAULT NULL,
    "oauth_token" text DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS "sessions" (
    "id" text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL DEFAULT NULL,
    "expires" datetime NOT NULL DEFAULT NULL,
    PRIMARY KEY (sessionToken)
);

CREATE TABLE IF NOT EXISTS "users" (
    "id" text NOT NULL DEFAULT '',
    "name" text DEFAULT NULL,
    "email" text DEFAULT NULL,
    "emailVerified" datetime DEFAULT NULL,
    "image" text DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS "verification_tokens" (
    "identifier" text NOT NULL,
    "token" text NOT NULL DEFAULT NULL,
    "expires" datetime NOT NULL DEFAULT NULL,
    PRIMARY KEY (token)
);

CREATE TABLE IF NOT EXISTS "user_creations" (
    "id" text NOT NULL,
    "lastEdited" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "versionId" number NOT NULL DEFAULT 0,
    "creator" text NOT NULL DEFAULT '',
    FOREIGN KEY (creator) REFERENCES users(id),
    PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS "user_creations_creator" ON "user_creations" ("creator");

CREATE TABLE IF NOT EXISTS "pending_submissions" (
    "storage_id" text NOT NULL,
    "desired_id" text NOT NULL,
    "creator" text NOT NULL,
    FOREIGN KEY (creator) REFERENCES users(id),
    PRIMARY KEY (storage_id)
);

CREATE INDEX IF NOT EXISTS "pending_submissions_desired_id" ON "pending_submissions" ("desired_id");

CREATE TABLE IF NOT EXISTS "approved_submissions" (
    "storage_id" text NOT NULL,
    "title" text NOT NULL,
    "author" text NOT NULL,
    "published_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "public_url" text NOT NULL,
    "subjects" text NOT NULL,
    "grades" text NOT NULL,
    "slides_count" number NOT NULL,
    "played_count" number NOT NULL,
    "thumbnail_alt" text DEFAULT NULL,
    "language_code" text NOT NULL,
    "thumbnail" BLOB DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS "denied_submissions" (
    "storage_id" text NOT NULL,
    "desired_id" text NOT NULL,
    "deniedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" text DEFAULT NULL
);