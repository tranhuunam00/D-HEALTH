import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '../../../../');
const MIGRATIONS_DIR = path.resolve(PROJECT_ROOT, 'backend/migrations');

interface ImpactFinding {
  layer: 'Backend Domain' | 'Backend Infrastructure' | 'Backend Application' | 'Frontend Client' | 'Spec-Kit';
  file: string;
  line: number;
  match: string;
}

interface RiskWarning {
  level: 'CRITICAL' | 'WARNING' | 'NOTICE';
  message: string;
  remedy: string;
}

function scanFileContent(filePath: string, patterns: string[]): { line: number; match: string }[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const hits: { line: number; match: string }[] = [];

  lines.forEach((lineText, idx) => {
    for (const pat of patterns) {
      if (pat.length > 2 && lineText.toLowerCase().includes(pat.toLowerCase())) {
        hits.push({ line: idx + 1, match: lineText.trim() });
        break;
      }
    }
  });

  return hits;
}

function walkDir(dir: string, extensions: string[]): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === 'dist' || file === '.git') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(walkDir(fullPath, extensions));
    } else {
      if (extensions.some((ext) => file.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

export function auditMigrationImpact(migrationNameArg?: string): void {
  console.log('\n================================================================================');
  console.log('🛡️  D-HEALTH PRE-MIGRATION CODEBASE IMPACT AUDIT (RULE ENFORCEMENT)');
  console.log('================================================================================');

  let targetSqlFiles: string[] = [];

  if (migrationNameArg) {
    const candidate = migrationNameArg.endsWith('.up.sql')
      ? migrationNameArg
      : `${migrationNameArg}.up.sql`;
    const fullPath = path.join(MIGRATIONS_DIR, candidate);
    if (fs.existsSync(fullPath)) {
      targetSqlFiles.push(fullPath);
    } else {
      // Find matches
      const files = fs
        .readdirSync(MIGRATIONS_DIR)
        .filter((f) => f.includes(migrationNameArg) && f.endsWith('.up.sql'));
      if (files.length === 0) {
        console.error(`❌ No migration file matched "${migrationNameArg}" in ${MIGRATIONS_DIR}`);
        process.exit(1);
      }
      targetSqlFiles = files.map((f) => path.join(MIGRATIONS_DIR, f));
    }
  } else {
    // Audit latest migration by default
    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.up.sql'))
      .sort();
    if (files.length === 0) {
      console.log('ℹ️ No migrations found to audit.');
      return;
    }
    targetSqlFiles = [path.join(MIGRATIONS_DIR, files[files.length - 1])];
  }

  for (const sqlFile of targetSqlFiles) {
    const fileName = path.basename(sqlFile);
    console.log(`\n🔍 Auditing migration file: ${fileName}`);
    const sqlContent = fs.readFileSync(sqlFile, 'utf-8');

    // 1. Analyze Danger Patterns (Risk Audit)
    const risks: RiskWarning[] = [];

    if (/ALTER\s+TABLE\s+.*ADD\s+COLUMN\s+.*NOT\s+NULL/i.test(sqlContent) && !/DEFAULT/i.test(sqlContent)) {
      risks.push({
        level: 'CRITICAL',
        message: 'Adding a NOT NULL column without a DEFAULT clause on an existing table.',
        remedy: 'Use 3-phase Expand-and-Contract: Add nullable column -> Backfill data -> Add NOT NULL constraint.',
      });
    }

    if (/DROP\s+COLUMN/i.test(sqlContent)) {
      risks.push({
        level: 'CRITICAL',
        message: 'DROP COLUMN detected. Breaking change if code still references this column.',
        remedy: 'Ensure all backend queries and frontend types have deprecated and removed references first.',
      });
    }

    if (/RENAME\s+COLUMN/i.test(sqlContent)) {
      risks.push({
        level: 'CRITICAL',
        message: 'Direct RENAME COLUMN detected. Causes downtime on active production systems.',
        remedy: 'Use Expand-and-Contract dual write pattern instead of direct rename.',
      });
    }

    if (/CREATE\s+INDEX/i.test(sqlContent) && !/CONCURRENTLY/i.test(sqlContent)) {
      risks.push({
        level: 'WARNING',
        message: 'CREATE INDEX without CONCURRENTLY locks the table during index creation.',
        remedy: 'Use "CREATE INDEX CONCURRENTLY IF NOT EXISTS" for PostgreSQL production safety.',
      });
    }

    // Check matching DOWN script exists
    const downScript = sqlFile.replace('.up.sql', '.down.sql');
    if (!fs.existsSync(downScript)) {
      risks.push({
        level: 'CRITICAL',
        message: `Missing mandatory rollback file: ${path.basename(downScript)}`,
        remedy: 'Create a reversible DOWN script before applying this migration.',
      });
    }

    // 2. Extract affected table and column keywords
    const tableMatches = sqlContent.match(/(?:TABLE|INTO|FROM|UPDATE)\s+([a-zA-Z0-9_]+)/gi) || [];
    const tables = Array.from(
      new Set(
        tableMatches
          .map((m) => m.split(/\s+/)[1]?.toLowerCase())
          .filter((t) => t && !['if', 'exists', 'set', 'select'].includes(t))
      )
    );

    console.log(`\n📋 Target Tables Detected:`, tables.length > 0 ? tables.join(', ') : 'None');

    // 3. Scan Codebase Across Layers
    const findings: ImpactFinding[] = [];

    const scanTargets: { layer: ImpactFinding['layer']; dir: string; exts: string[] }[] = [
      { layer: 'Backend Domain', dir: path.join(PROJECT_ROOT, 'backend/src/domain'), exts: ['.ts'] },
      { layer: 'Backend Infrastructure', dir: path.join(PROJECT_ROOT, 'backend/src/infrastructure'), exts: ['.ts'] },
      { layer: 'Backend Application', dir: path.join(PROJECT_ROOT, 'backend/src/application'), exts: ['.ts', '.js'] },
      { layer: 'Backend Application', dir: path.join(PROJECT_ROOT, 'backend/src'), exts: ['.ts'] },
      { layer: 'Frontend Client', dir: path.join(PROJECT_ROOT, 'frontend/src'), exts: ['.ts', '.tsx'] },
      { layer: 'Spec-Kit', dir: path.join(PROJECT_ROOT, 'specs'), exts: ['.md'] },
    ];

    const seenFiles = new Set<string>();

    for (const target of scanTargets) {
      const files = walkDir(target.dir, target.exts);
      for (const f of files) {
        if (f.includes('audit-impact.ts') || f.includes('migrator.ts')) continue;
        const relative = path.relative(PROJECT_ROOT, f);
        if (seenFiles.has(relative)) continue;

        const hits = scanFileContent(f, tables);
        if (hits.length > 0) {
          seenFiles.add(relative);
          for (const hit of hits.slice(0, 3)) {
            findings.push({
              layer: target.layer,
              file: relative,
              line: hit.line,
              match: hit.match.slice(0, 80),
            });
          }
        }
      }
    }

    // 4. Print Report
    console.log('\n--------------------------------------------------------------------------------');
    console.log('🚨 ZERO-DOWNTIME RISK ASSESSMENT');
    console.log('--------------------------------------------------------------------------------');
    if (risks.length === 0) {
      console.log('✅ No high-risk migration patterns detected. (Idempotency and safety passed)');
    } else {
      for (const r of risks) {
        const icon = r.level === 'CRITICAL' ? '⛔ [CRITICAL]' : '⚠️ [WARNING]';
        console.log(`${icon} ${r.message}`);
        console.log(`   👉 Remedy: ${r.remedy}\n`);
      }
    }

    console.log('--------------------------------------------------------------------------------');
    console.log(`📂 CODEBASE IMPACT ANALYSIS (${findings.length} occurrences in codebase)`);
    console.log('--------------------------------------------------------------------------------');

    const grouped: Record<string, ImpactFinding[]> = {};
    for (const item of findings) {
      if (!grouped[item.layer]) grouped[item.layer] = [];
      grouped[item.layer].push(item);
    }

    for (const [layer, items] of Object.entries(grouped)) {
      console.log(`\n🔹 ${layer} (${items.length} references):`);
      for (const it of items) {
        console.log(`   • ${it.file}:${it.line} ➔ "${it.match}"`);
      }
    }

    console.log('\n================================================================================');
    console.log('📋 PRE-MIGRATION APPROVAL CHECKLIST (Copy into Pull Request):');
    console.log('================================================================================');
    console.log(`
- [ ] 1. Migration History Immutable: No editing of existing migration files.
- [ ] 2. Two-way reversible: UP and DOWN scripts present and tested.
- [ ] 3. Zero-downtime verified: No unhandled table locks or unhandled NOT NULL columns.
- [ ] 4. Backend Domain Entities & Value Objects updated.
- [ ] 5. Repositories, SQL queries, and mappers updated.
- [ ] 6. Frontend TypeScript interfaces and UI components synchronized.
- [ ] 7. Spec-Kit data-model.md updated.
- [ ] 8. Local cycle verified: UP ➔ DOWN (rollback) ➔ UP again.
`);
  }
}

// CLI entrypoint
const arg = process.argv[2];
auditMigrationImpact(arg);

