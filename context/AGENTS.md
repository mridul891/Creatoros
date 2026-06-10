# AGENTS.md — DealFlow Agent Orchestration

> This file defines agent roles, boundaries, and coordination rules for DealFlow.
> Read this if you are operating as a sub-agent or if multiple agents are running in parallel.

---

## Agent Roles

### 🏗️ Builder Agent (Primary)
**Responsibility:** Feature implementation — database, API routes, server actions, UI components.
**Reads:** `CLAUDE.md`, `context/architecture.md`, `context/code-standards.md`, `context/ui-registry.md`
**Writes to:** `app/`, `components/`, `lib/`, `types/`
**Must not:** Modify `context/` files without explicit user approval

### 🎨 UI Agent
**Responsibility:** Visual components, Tailwind styling, mobile responsiveness, design system.
**Reads:** `context/ui-tokens.md`, `context/ui-rules.md`, `context/ui-registry.md`
**Writes to:** `components/`, `app/` (layout and page shells only)
**Must not:** Touch API routes, Supabase queries, or Stripe integration

### 🗄️ Database Agent
**Responsibility:** Supabase schema, RLS policies, migrations, data model.
**Reads:** `context/architecture.md`
**Writes to:** `supabase/migrations/`, `lib/supabase/`, `types/database.ts`
**Must not:** Modify frontend code

### 📋 Planner Agent
**Responsibility:** Updating progress tracker, breaking tasks into subtasks, flagging blockers.
**Reads:** `context/build-plan.md`, `context/progress-tracker.md`
**Writes to:** `context/progress-tracker.md` only
**Must not:** Write any application code

---

## Coordination Rules

1. **One agent modifies one domain at a time.** If Builder needs a DB change, it flags it for Database Agent — it doesn't do it itself.
2. **UI Registry is a shared contract.** Any agent that creates or modifies a component must update `context/ui-registry.md`.
3. **No agent ships untested code.** Every feature must have a manual smoke test before marking complete in progress-tracker.
4. **Context files are append-only for decisions.** Add new decisions. Don't rewrite history.

---

## Handoff Protocol

When passing a task between agents, include:
- What was completed
- What state was left in (e.g., "DB migration applied but not tested")
- What the next agent needs to do first
- Any open questions or blockers

---

## Escalation

If any agent encounters ambiguity about scope, priority, or product behaviour:
→ Stop and ask the user. Do not assume. Do not fill in the blanks with guesses.
