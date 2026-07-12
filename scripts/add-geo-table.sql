CREATE TABLE IF NOT EXISTS public.api_usage (
  usage_date DATE NOT NULL,
  sku TEXT NOT NULL,
  count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (usage_date, sku)
);
