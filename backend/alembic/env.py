"""
alembic/env.py
──────────────
Alembic migration environment configuration.

Key jobs:
  1. Load our .env settings so Alembic knows the DATABASE_URL.
  2. Import all our ORM models so Alembic can detect schema changes.
  3. Run migrations in "online" mode (directly against the live DB).
"""

from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
import sys

# ── Make sure 'app' package is importable from alembic/ directory ─────────────
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

# ── Load our settings (reads .env) ────────────────────────────────────────────
from app.config import settings

# ── Import Base AND all models so Alembic knows about the schema ──────────────
from app.db.database import Base
import app.db.models  # noqa — CRITICAL: registers all models with Base.metadata

# Alembic Config object (reads alembic.ini)
config = context.config

# Set the DB URL dynamically from .env (overrides blank sqlalchemy.url in ini)
config.set_main_option("sqlalchemy.url", settings.database_url)

# Set up Python logging from alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# The metadata Alembic compares against to detect changes
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Runs migrations without a live DB connection (generates SQL script)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        render_as_batch=url.startswith("sqlite"),  # SQLite needs batch mode for ALTER TABLE
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Runs migrations against the live database."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        is_sqlite = settings.database_url.startswith("sqlite")
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
            render_as_batch=is_sqlite,  # Required for SQLite ALTER TABLE support
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
