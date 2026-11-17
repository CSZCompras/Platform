# Econocompras Frontend (Platform) Constitution

## Core Principles

### I. Two-Level Routing Ownership
`app.ts` owns only the unauthenticated routes (`login`, `invite`, `forgotMyPassword`, `welcome`)
plus the single `econocompras` route that loads `views/master`. Every authenticated screen's route
MUST be added to `master.ts`'s child router, not to `app.ts`. Every route's `moduleId` MUST be
wrapped in `PLATFORM.moduleName(...)`.
Rationale: the CLI bundler resolves `moduleId`s statically at build time; a bare string route
works in `au run --watch` but silently fails to bundle in `au build --env prod`, so this is a
"works on my machine" trap that only shows up in production.

### II. Repositories Are the Only HTTP Boundary
Only classes under `repositories/` may call `aurelia-api`'s `Rest` client or `HttpClient`
directly. Views, services, and validators MUST go through a repository method, never issue their
own HTTP call.
Rationale: this is the one place error handling, the `authtoken` header, and the API base URL are
centralized; bypassing it duplicates that plumbing and drifts from it over time.

### III. Repository Methods MUST Re-throw on HTTP Failure
Every repository method wrapping an HTTP call MUST end its `.catch()` with the established idiom
(`return Promise.resolve(e.json().then(error => { throw error; }))`) rather than swallowing the
error or resolving successfully. Every call site consuming a repository method MUST attach its own
`.catch()`.
Rationale: a repository that resolves instead of rejecting on error, or a caller that omits
`.catch()`, is indistinguishable from a hang to the user — see Principle IV.

### IV. No Dangling `isLoading`
Any view-model introducing an `isLoading`-style flag MUST clear it on every code path out of the
operation it guards, including early returns and promise rejections — not only the success branch
of the main `.then()`.
Rationale: `atualizacaoDePrecos.ts`'s `loadProducts()` shipped exactly this bug: an early return
when no price list was selected left `isLoading = true` forever, and a `Promise.all([...])` with
one uncaught rejection would have done the same. Treat this as a known, recurring failure class,
not a one-off.

### V. Don't Assume a Backend-Optional Precondition Holds
Code MUST NOT assume a backend-optional field is always set on at least one record in a
collection (e.g. assuming some `PriceList` has `isDefaultPriceList === true`). Where the backend
cannot yet guarantee it, provide an explicit fallback (e.g. the first element) rather than
silently doing nothing when the assumption fails.
Rationale: the same incident above was a backend data gap, but the frontend's silent
non-handling of the empty-filter case is what turned it into an infinite spinner instead of a
visible, debuggable state.

### VI. Cross-Repo Enum and Contract Parity
Enums and view-model shapes here under `domain/` mirror entities and enums in the Backend repo's
`CSZ.Domain`. There is no shared package or generation step. A change to one side's enum values,
or to an endpoint path (including ones with backend typos, e.g. `alterSuplierProduct`) MUST be
made together with the corresponding change on the other repo, in the same effort.
Rationale: the two repos are developed independently with no compiler to catch drift between
them; the only thing that catches it is discipline.

## Build & Environment

Environment values (`apiAddress`, `debug`, `testing`) are generated from
`aurelia_project/environments/{dev,stage,prod}.ts` into `src/environment.ts` by the Aurelia CLI
build. `src/environment.ts` itself MUST NOT be hand-edited — edit the environment source files
under `aurelia_project/environments/` instead. The actual application source is
`src/src/`, not `src/`; searches and new files belong there, not in the CLI project root.

## Development Workflow

Follow the existing code's idiom rather than introducing stricter typing piecemeal: `noImplicitAny`
is off and `<any>` casts are used deliberately to attach ad-hoc view state (e.g. `item.isEditing`).
Run `au lint` and `au test` before considering a change done, even though the existing test suite
is thin — do not let that thinness be a reason to skip running it.
See `CLAUDE.md` at the repository root for the full architecture map, commands, and the complete
list of known traps — this constitution states the non-negotiable rules; `CLAUDE.md` is where the
supporting detail lives and MUST be kept consistent with it.

## Governance

This constitution supersedes ad hoc convention for anything it addresses. A pull request that
knowingly violates a principle here MUST say so in its description and state the justification;
silent violations are not acceptable.

Amendments are made by editing this file and bumping `CONSTITUTION_VERSION` per semantic
versioning: MAJOR for removing or redefining a principle, MINOR for adding one or materially
expanding guidance, PATCH for wording/clarity fixes. `LAST_AMENDED_DATE` MUST be updated on every
change; `RATIFICATION_DATE` never changes once set.

**Version**: 1.0.0 | **Ratified**: 2026-11-17 | **Last Amended**: 2026-11-17
