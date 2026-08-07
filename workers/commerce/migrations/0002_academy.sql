PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS academy_courses (
  course_id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  current_version INTEGER NOT NULL CHECK (current_version > 0),
  status TEXT NOT NULL CHECK (status IN ('draft', 'review', 'available', 'archived')),
  membership_grant TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS academy_course_versions (
  course_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  manifest_hash TEXT NOT NULL,
  published_at INTEGER,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (course_id, version),
  FOREIGN KEY (course_id) REFERENCES academy_courses(course_id)
);

CREATE TABLE IF NOT EXISTS academy_lessons (
  lesson_id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  lesson_order INTEGER NOT NULL,
  access TEXT NOT NULL CHECK (access IN ('public', 'paid')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  updated_at INTEGER NOT NULL,
  UNIQUE (course_id, lesson_order),
  FOREIGN KEY (course_id) REFERENCES academy_courses(course_id)
);

CREATE TABLE IF NOT EXISTS academy_products (
  product_key TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  currency TEXT NOT NULL CHECK (currency = 'USD'),
  amount INTEGER NOT NULL CHECK (amount >= 0),
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'retired')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS academy_provider_prices (
  provider TEXT NOT NULL,
  provider_price_id TEXT NOT NULL,
  product_key TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('test', 'active', 'retired')),
  verified_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (provider, provider_price_id),
  UNIQUE (provider, product_key, status),
  FOREIGN KEY (product_key) REFERENCES academy_products(product_key)
);

CREATE TABLE IF NOT EXISTS academy_product_grants (
  product_key TEXT NOT NULL,
  course_id TEXT NOT NULL,
  grant_kind TEXT NOT NULL DEFAULT 'permanent' CHECK (grant_kind IN ('permanent')),
  created_at INTEGER NOT NULL,
  PRIMARY KEY (product_key, course_id),
  FOREIGN KEY (product_key) REFERENCES academy_products(product_key),
  FOREIGN KEY (course_id) REFERENCES academy_courses(course_id)
);

CREATE TABLE IF NOT EXISTS academy_purchases (
  purchase_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_key TEXT NOT NULL,
  provider TEXT NOT NULL,
  checkout_token TEXT NOT NULL,
  provider_order_id TEXT,
  provider_payment_id TEXT,
  provider_customer_id TEXT,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL CHECK (currency = 'USD'),
  status TEXT NOT NULL CHECK (status IN ('checkout_pending', 'paid', 'refunded', 'disputed', 'failed', 'expired', 'revoked')),
  last_provider_event_created INTEGER,
  paid_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (user_id, checkout_token),
  UNIQUE (provider, provider_order_id),
  UNIQUE (provider, provider_payment_id),
  FOREIGN KEY (product_key) REFERENCES academy_products(product_key)
);

CREATE INDEX IF NOT EXISTS academy_purchases_user_idx
  ON academy_purchases (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS academy_entitlements (
  entitlement_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  grant_type TEXT NOT NULL CHECK (grant_type IN ('purchase', 'manual')),
  grant_identity TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'suspended', 'revoked')),
  source_purchase_id TEXT,
  reason TEXT,
  operator_id TEXT,
  granted_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (user_id, course_id, grant_type, grant_identity),
  FOREIGN KEY (course_id) REFERENCES academy_courses(course_id),
  FOREIGN KEY (source_purchase_id) REFERENCES academy_purchases(purchase_id)
);

CREATE INDEX IF NOT EXISTS academy_entitlements_user_course_idx
  ON academy_entitlements (user_id, course_id, status);

CREATE TABLE IF NOT EXISTS academy_events (
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  purchase_id TEXT,
  event_created INTEGER NOT NULL,
  payload_hash TEXT NOT NULL,
  outcome TEXT NOT NULL,
  recorded_at INTEGER NOT NULL,
  PRIMARY KEY (provider, event_id),
  FOREIGN KEY (purchase_id) REFERENCES academy_purchases(purchase_id)
);

CREATE TABLE IF NOT EXISTS academy_progress (
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('started', 'complete')),
  client_updated_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, course_id, lesson_id),
  FOREIGN KEY (course_id) REFERENCES academy_courses(course_id)
);

CREATE INDEX IF NOT EXISTS academy_progress_user_idx
  ON academy_progress (user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS academy_question_reports (
  report_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id TEXT,
  category TEXT NOT NULL CHECK (category IN ('content', 'tool', 'access', 'other')),
  question TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (course_id) REFERENCES academy_courses(course_id)
);

CREATE INDEX IF NOT EXISTS academy_questions_open_idx
  ON academy_question_reports (status, course_id, lesson_id, created_at DESC);

CREATE VIEW IF NOT EXISTS academy_unanswered_question_report AS
SELECT
  course_id,
  COALESCE(lesson_id, 'course-wide') AS lesson_id,
  category,
  COUNT(*) AS open_count,
  MIN(created_at) AS oldest_open_at,
  MAX(created_at) AS newest_open_at
FROM academy_question_reports
WHERE status = 'open'
GROUP BY course_id, COALESCE(lesson_id, 'course-wide'), category;

CREATE TABLE IF NOT EXISTS academy_access_corrections (
  correction_id TEXT PRIMARY KEY,
  entitlement_id TEXT NOT NULL,
  operator_id TEXT NOT NULL,
  previous_status TEXT NOT NULL,
  next_status TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (entitlement_id) REFERENCES academy_entitlements(entitlement_id)
);

INSERT OR IGNORE INTO academy_courses
  (course_id, slug, current_version, status, membership_grant, created_at, updated_at)
VALUES
  ('academy-course-self-defense-v1', 'intellectual-self-defense', 1, 'available', NULL, unixepoch(), unixepoch()),
  ('academy-course-avatar-v1', 'avatar-content-system', 1, 'available', 'academy_all_access', unixepoch(), unixepoch()),
  ('academy-course-character-v1', 'keep-the-character', 1, 'review', 'academy_all_access', unixepoch(), unixepoch());

INSERT OR IGNORE INTO academy_products
  (product_key, title, currency, amount, status, created_at, updated_at)
VALUES
  ('academy_avatar_content_system_v1', 'Avatar Content System Starter Kit', 'USD', 700, 'draft', unixepoch(), unixepoch()),
  ('academy_keep_the_character_v1', 'Keep the Character', 'USD', 700, 'draft', unixepoch(), unixepoch());

INSERT OR IGNORE INTO academy_product_grants
  (product_key, course_id, grant_kind, created_at)
VALUES
  ('academy_avatar_content_system_v1', 'academy-course-avatar-v1', 'permanent', unixepoch()),
  ('academy_keep_the_character_v1', 'academy-course-character-v1', 'permanent', unixepoch());
