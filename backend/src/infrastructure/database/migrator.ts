import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const MIGRATIONS_DIR = path.resolve(__dirname, '../../../../migrations');

interface MigrationRecord {
  id: number;
  name: string;
  checksum: string;
  applied_at: Date;
  execution_time_ms: number;
}

function calculateChecksum(content: string): string {
  return crypto.createHash('sha256').update(content.trim()).digest('hex');
}

async function getClient(): Promise<Client> {
  const connectionString =
    process.env.DATABASE_URL ||
    'postgresql://dhealth_user:dhealth_secret_2026@localhost:7003/dhealth_db';

  const client = new Client({ connectionString });
  await client.connect();
  return client;
}

async function ensureMigrationLedger(client: Client): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      checksum VARCHAR(64) NOT NULL,
      applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      execution_time_ms INTEGER NOT NULL
    );
  `);
}

async function getAppliedMigrations(client: Client): Promise<MigrationRecord[]> {
  await ensureMigrationLedger(client);
  const result = await client.query<MigrationRecord>(
    'SELECT * FROM _migrations ORDER BY id ASC'
  );
  return result.rows;
}

export async function migrateUp(): Promise<void> {
  console.log('\n🚀 [D-Health Migrator] Starting database migration (UP)...');
  const client = await getClient();

  try {
    const applied = await getAppliedMigrations(client);
    const appliedMap = new Map<string, MigrationRecord>();
    for (const r of applied) {
      appliedMap.set(r.name, r);
    }

    if (!fs.existsSync(MIGRATIONS_DIR)) {
      fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
    }

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.up.sql'))
      .sort();

    if (files.length === 0) {
      console.log('ℹ️ No migration files found in', MIGRATIONS_DIR);
      return;
    }

    // 1. Verify tamper detection on already applied migrations
    for (const file of files) {
      const baseName = file.replace('.up.sql', '');
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf-8');
      const currentChecksum = calculateChecksum(sql);

      const record = appliedMap.get(baseName);
      if (record) {
        if (record.checksum !== currentChecksum) {
          throw new Error(
            `🚨 [CRITICAL VIOLATION - TAMPER DETECTED]\n` +
              `Migration "${baseName}" was modified AFTER being applied!\n` +
              `Recorded Checksum: ${record.checksum}\n` +
              `Current File Hash: ${currentChecksum}\n` +
              `Violates Zero-Direct-Schema-Edit & Immutable History Rules!\n` +
              `Revert the file or write a NEW migration file to make changes.`
          );
        }
      }
    }

    // 2. Apply pending migrations
    let pendingCount = 0;
    for (const file of files) {
      const baseName = file.replace('.up.sql', '');
      if (appliedMap.has(baseName)) {
        continue;
      }

      pendingCount++;
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf-8');
      const checksum = calculateChecksum(sql);

      console.log(`\n⏳ Applying migration: ${file}...`);
      const startTime = Date.now();

      await client.query('BEGIN');
      try {
        await client.query(sql);
        const duration = Date.now() - startTime;

        await client.query(
          `INSERT INTO _migrations (name, checksum, execution_time_ms) VALUES ($1, $2, $3)`,
          [baseName, checksum, duration]
        );

        await client.query('COMMIT');
        console.log(`✅ [APPLIED] ${baseName} (${duration}ms) [Hash: ${checksum.slice(0, 8)}...]`);
      } catch (err: any) {
        await client.query('ROLLBACK');
        console.error(`❌ [FAILED] Migration ${file} failed! Transaction rolled back.`);
        throw err;
      }
    }

    if (pendingCount === 0) {
      console.log('✨ [UP-TO-DATE] Database schema is already up to date. No pending migrations.');
    } else {
      console.log(`\n🎉 Successfully applied ${pendingCount} migration(s).`);
    }
  } finally {
    await client.end();
  }
}

export async function migrateDown(): Promise<void> {
  console.log('\n⏪ [D-Health Migrator] Reversing last database migration (DOWN)...');
  const client = await getClient();

  try {
    const applied = await getAppliedMigrations(client);
    if (applied.length === 0) {
      console.log('ℹ️ No applied migrations found to rollback.');
      return;
    }

    const lastMigration = applied[applied.length - 1];
    const downFileName = `${lastMigration.name}.down.sql`;
    const downFilePath = path.join(MIGRATIONS_DIR, downFileName);

    if (!fs.existsSync(downFilePath)) {
      throw new Error(
        `🚨 Cannot rollback: Missing required rollback file "${downFileName}". ` +
          `Every migration must have a matching .down.sql script!`
      );
    }

    const downSql = fs.readFileSync(downFilePath, 'utf-8');
    console.log(`⏳ Reverting: ${downFileName}...`);
    const startTime = Date.now();

    await client.query('BEGIN');
    try {
      await client.query(downSql);
      await client.query('DELETE FROM _migrations WHERE id = $1', [lastMigration.id]);
      await client.query('COMMIT');

      const duration = Date.now() - startTime;
      console.log(`✅ [REVERTED] ${lastMigration.name} (${duration}ms)`);
    } catch (err: any) {
      await client.query('ROLLBACK');
      console.error(`❌ [ROLLBACK FAILED] Transaction aborted.`);
      throw err;
    }
  } finally {
    await client.end();
  }
}

export async function migrationStatus(): Promise<void> {
  console.log('\n📊 [D-Health Migrator] Migration Status Ledger');
  const client = await getClient();

  try {
    const applied = await getAppliedMigrations(client);
    const appliedMap = new Map<string, MigrationRecord>();
    for (const r of applied) {
      appliedMap.set(r.name, r);
    }

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.up.sql'))
      .sort();

    console.log('--------------------------------------------------------------------------------');
    console.log(
      `${'Status'.padEnd(10)} | ${'Migration Name'.padEnd(35)} | ${'Applied At'.padEnd(20)} | Checksum`
    );
    console.log('--------------------------------------------------------------------------------');

    for (const file of files) {
      const baseName = file.replace('.up.sql', '');
      const rec = appliedMap.get(baseName);
      if (rec) {
        const dateStr = new Date(rec.applied_at).toLocaleString();
        console.log(
          `✅ APPLIED  | ${baseName.padEnd(35)} | ${dateStr.padEnd(20)} | ${rec.checksum.slice(0, 8)}...`
        );
      } else {
        console.log(`⏳ PENDING  | ${baseName.padEnd(35)} | ${'--'.padEnd(20)} | --`);
      }
    }
    console.log('--------------------------------------------------------------------------------\n');
  } finally {
    await client.end();
  }
}

export function createMigration(name: string): void {
  if (!name) {
    console.error('❌ Please provide a migration name: npm run migrate:create <name>');
    process.exit(1);
  }

  const sanitized = name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  const files = fs.existsSync(MIGRATIONS_DIR)
    ? fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.up.sql'))
    : [];

  const nextSeq = String(files.length + 1).padStart(3, '0');
  const baseName = `${nextSeq}_${sanitized}`;

  const upFile = path.join(MIGRATIONS_DIR, `${baseName}.up.sql`);
  const downFile = path.join(MIGRATIONS_DIR, `${baseName}.down.sql`);

  const upTemplate = `-- ====================================================================
-- MIGRATION ${nextSeq} (UP): ${sanitized.toUpperCase()}
-- Author: D-Health Engineering Team
-- Rule: Zero-Downtime, Expand-and-Contract, Idempotent
-- ====================================================================

-- Write your UP migration SQL here:
-- Example:
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS example_col VARCHAR(100);
`;

  const downTemplate = `-- ====================================================================
-- MIGRATION ${nextSeq} (DOWN): REVERSE ${sanitized.toUpperCase()}
-- ====================================================================

-- Write your DOWN rollback SQL here:
-- Example:
-- ALTER TABLE users DROP COLUMN IF EXISTS example_col;
`;

  fs.writeFileSync(upFile, upTemplate, 'utf-8');
  fs.writeFileSync(downFile, downTemplate, 'utf-8');

  console.log(`\n🎉 Created new migration pair:`);
  console.log(`  📄 UP:   backend/migrations/${baseName}.up.sql`);
  console.log(`  📄 DOWN: backend/migrations/${baseName}.down.sql`);
  console.log(`\n⚠️ MANDATORY NEXT STEP: Run impact analysis before applying!`);
  console.log(`  Command: npm run db:audit ${baseName}`);
}

// CLI Execution entrypoint
const action = process.argv[2];
const arg = process.argv[3];

if (action === 'up') {
  migrateUp().catch((err) => {
    console.error(err);
    process.exit(1);
  });
} else if (action === 'down') {
  migrateDown().catch((err) => {
    console.error(err);
    process.exit(1);
  });
} else if (action === 'status') {
  migrationStatus().catch((err) => {
    console.error(err);
    process.exit(1);
  });
} else if (action === 'create') {
  createMigration(arg);
} else {
  console.log(`
Usage:
  tsx migrator.ts up          Apply all pending migrations
  tsx migrator.ts down        Rollback the last migration
  tsx migrator.ts status      Check migration ledger status
  tsx migrator.ts create <name> Create a new UP/DOWN migration template
  `);
}
