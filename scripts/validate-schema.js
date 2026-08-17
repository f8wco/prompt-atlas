'use strict';
/* Validates core.json against schema/core.schema.json with ajv.
   Structural contract (types/required/enum/range) is enforced HERE;
   semantic contract (references/symmetry/aliases) is enforced by validate-core.js.
   Run: node scripts/validate-schema.js   (CI runs both) */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const ajv = new Ajv({ allErrors: true });
const schema = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'schema', 'core.schema.json'), 'utf8'));
const core = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'core.json'), 'utf8'));

const validate = ajv.compile(schema);
if (!validate(core)) {
  console.error('✗ core.json violates JSON Schema (' + validate.errors.length + ' issues):');
  validate.errors.forEach(function (e) {
    console.error('  - ' + (e.instancePath || '(root)') + ' ' + e.message);
  });
  process.exit(1);
}
console.log('✓ core.json passes JSON Schema (version ' + core.version + ', ' + core.atoms.length + ' atoms)');
