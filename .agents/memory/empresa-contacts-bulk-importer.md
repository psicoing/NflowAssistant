---
name: Empresa contacts bulk importer
description: Design decisions behind the semicolon-delimited bulk importer for empresa_contacts (POST /api/admin/empresas/import-bulk).
---

## Format
Fixed 10-field order, one record per line, fields separated by `;`:
`EMPRESA;EMAIL;TELÉFONO;DIRECCIÓN;CÓDIGO POSTAL;MUNICIPIO;PROVINCIA;NÚMERO DE EMPLEADOS;ÁREA DEL CONTACTO;PRIORIDAD`.
A line that doesn't split into exactly 10 fields is skipped and reported as an error rather than guessed at — the user was explicit that missing data must stay empty, never be invented or shifted into the wrong column.

## Dedupe key
Matches existing contacts by `lower(email)` only, not a composite `(company, email)` key.

**Why:** `empresa_contacts.email` already has a database-level `UNIQUE` constraint used everywhere else in the app (manual add, CSV import, campaign sending). Introducing a separate composite-key dedupe path would fight that constraint and create two different notions of "the same contact." Since one email realistically belongs to one company, matching on email alone satisfies the user's "dedupe by company + email" intent without a schema change.

## Merge rule for existing contacts
On a matching email, only NULL/empty destination fields get filled from the imported row (`COALESCE(NULLIF(existing, ''), NULLIF(new, ''))`); non-empty existing values are never overwritten. `employee_count` (integer) uses plain `COALESCE(existing, new)` since it has no empty-string state.

**Why:** explicit user requirement — re-importing a list must fill gaps in existing records, not clobber manually corrected or previously-imported data.

## Data model note
`employee_count` (exact headcount per contact, from the import) is a separate column from `company_size` (the pre-existing categorical bucket like `5k_19999` used for campaign segmentation and manually/seed-assigned). They are intentionally not derived from each other — `employee_count` is importer-sourced raw data, `company_size` remains the curated segmentation field.

`phone` and `address` columns exist on `empresa_contacts` specifically so future call/visit campaigns can reuse the same contact record independently of email campaigns, per explicit user request — no call/visit campaign UI exists yet, only the storage.
