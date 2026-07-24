PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS commerce_orders (
  id TEXT PRIMARY KEY,
  public_id TEXT NOT NULL UNIQUE,
  checkout_token TEXT NOT NULL,
  user_id TEXT NOT NULL,
  email_hash TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'checkout_pending',
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  fulfillment_status TEXT NOT NULL DEFAULT 'not_ready',
  currency TEXT NOT NULL CHECK (currency = 'USD'),
  merchandise_subtotal_amount INTEGER NOT NULL CHECK (merchandise_subtotal_amount >= 0),
  shipping_amount INTEGER NOT NULL CHECK (shipping_amount >= 0),
  tax_amount INTEGER NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  tax_mode TEXT NOT NULL,
  catalog_revision TEXT NOT NULL,
  cart_fingerprint TEXT NOT NULL,
  cart_json TEXT NOT NULL,
  recipient_ciphertext TEXT,
  recipient_iv TEXT,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  printful_external_id TEXT NOT NULL UNIQUE,
  printful_order_id INTEGER UNIQUE,
  printful_status TEXT,
  printful_costs_json TEXT,
  last_error_code TEXT,
  paid_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (user_id, checkout_token)
);

CREATE INDEX IF NOT EXISTS commerce_orders_user_created_idx
  ON commerce_orders (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS commerce_orders_payment_idx
  ON commerce_orders (payment_status, fulfillment_status, updated_at);

CREATE TABLE IF NOT EXISTS commerce_events (
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  order_id TEXT,
  payload_hash TEXT NOT NULL,
  outcome TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (provider, event_id),
  FOREIGN KEY (order_id) REFERENCES commerce_orders(id)
);

CREATE INDEX IF NOT EXISTS commerce_events_order_idx
  ON commerce_events (order_id, created_at DESC);

CREATE TABLE IF NOT EXISTS commerce_fulfillment_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL,
  stage TEXT NOT NULL,
  outcome TEXT NOT NULL,
  provider_status INTEGER,
  error_code TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES commerce_orders(id)
);

CREATE INDEX IF NOT EXISTS commerce_fulfillment_attempts_order_idx
  ON commerce_fulfillment_attempts (order_id, created_at DESC);

CREATE TABLE IF NOT EXISTS commerce_refunds (
  stripe_refund_id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  stripe_event_id TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  reason TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES commerce_orders(id)
);

CREATE INDEX IF NOT EXISTS commerce_refunds_order_idx
  ON commerce_refunds (order_id, created_at DESC);

CREATE TABLE IF NOT EXISTS commerce_shipments (
  printful_shipment_id INTEGER PRIMARY KEY,
  order_id TEXT NOT NULL,
  shipment_status TEXT,
  delivery_status TEXT,
  carrier TEXT,
  service TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  shipped_at TEXT,
  delivered_at TEXT,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES commerce_orders(id)
);

CREATE INDEX IF NOT EXISTS commerce_shipments_order_idx
  ON commerce_shipments (order_id, updated_at DESC);
