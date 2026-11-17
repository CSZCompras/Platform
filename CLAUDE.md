# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Frontend (SPA) of **Econocompras / CSZ** — a B2B marketplace connecting food-service buyers
(*food services*) to food suppliers (*fornecedores*). Buyers build shopping lists, the backend runs a
price simulation across connected suppliers' price lists, and the result becomes orders.

The system has **two repositories**, both needed to understand most user-facing behavior:

| Repo | Path | Stack |
|---|---|---|
| Frontend (this one) | `C:\Users\Robson\Documents\GitHub\Platform` | Aurelia 1 + TypeScript + Aurelia CLI |
| Backend (REST API) | `C:\Users\Robson\Documents\GitHub\Backend` | ASP.NET Core 2.0 / EF Core / Azure SQL (see its CLAUDE.md) |

When a user reports a broken screen, **check both sides**. Several "backend bugs" turn out to be this
repo's error handling, and vice versa.

## Repo shape

The app lives in **`src/`**, not at the repo root — `src/` is the Aurelia CLI project directory
(`package.json`, `aurelia_project/`, `index.html`), and the actual source is `src/src/`. All commands
below run from `src/`.

```
src/
  aurelia_project/        Aurelia CLI config, build tasks, environments
  src/
    main.ts               Aurelia bootstrap, plugin + API endpoint registration
    app.ts                Root router: login / invite / welcome / econocompras shell
    views/
      master.ts/.html     Authenticated shell: child router with every app route, sidebar,
                          notification polling, global loading overlay
      fornecedor/         Supplier screens
      foodService/        Buyer screens (incl. guiaRapido/ onboarding wizard)
      admin/              Back-office screens
      cotacao/            Quotation flow
      components/
        partials/         ~21 reusable screen components + dialogs (the bulk of the UI)
        attributes/       Input masks (cnpj, cep, money, phone, datepicker, ...)
        valueConverters/  Display formatters, mirroring the masks
    repositories/         One class per API resource — the only place that talks to HTTP
    services/             Cross-cutting: identity, notifications, CEP/CNPJ lookup, PDF
    domain/               ~45 plain TS models mirroring the backend entities
    validators/           aurelia-validation rule sets
  test/                   Jasmine/Karma (effectively unused)
  workaround/mdb.js       Patched MDBootstrap
```

## Commands

Run from `src/` (needs `aurelia-cli`; use `npx au` if it is not installed globally):

```bash
npm install

au run --watch              # dev server + live reload, env=dev
au run --env stage
au build --env prod         # bundles into src/scripts/
au test                     # Karma + Jasmine, single run
au test --watch
au lint                     # tslint
```

`au` is the Aurelia CLI; each command is implemented by a task in `aurelia_project/tasks/`.

**Environments** live in `aurelia_project/environments/{dev,stage,prod}.ts` and are copied over
`src/environment.ts` at build time — never edit `src/src/environment.ts` directly, it is generated.
`dev` points `apiAddress` at `http://localhost:49791/api/`, which is where the backend's `CSZ.API`
project listens.

## Architecture conventions

**Aurelia 1 (not Aurelia 2)**: `@autoinject` constructor DI, `configureRouter`, `PLATFORM.moduleName`
wrappers on every route `moduleId` (required by the CLI bundler — omitting it breaks the prod build,
not the dev build). Views are `.html` templates paired by filename with their `.ts` view-model.

**Routing is two-level.** `app.ts` maps only the unauthenticated routes plus `econocompras`, which
loads `views/master`. `master.ts` holds the child router with ~45 routes for all three user roles.
New authenticated screens are added there.

**Repositories are the HTTP boundary.** Every API call goes through a class in `repositories/` using
`aurelia-api`'s `Rest` client (`this.api.find('priceList')`, `this.api.post('product', payload)`).
They all share this error idiom:

```ts
.catch((e) => {
    console.log(e);
    return Promise.resolve(e.json().then(error => { throw error; }));
});
```

That is, **repository methods re-throw** on HTTP errors. Callers must `.catch()` or the rejection
escapes.

**Auth** is a JWT kept in `localStorage` under `identity`, held in a **`static`** field on
`IdentityService`, and attached by a request interceptor as a custom **`authtoken` header** (not
`Authorization: Bearer`). `IdentityService.configureHttpClient` installs the interceptor once and
no-ops if any interceptor is already registered.

**Cross-component messaging** uses `EventAggregator` string channels rather than shared state —
e.g. `productAdded`, `uploadSupplierProductFileDone`, `supplierProductRemoved`, and the global
overlay's `loadingData` / `dataLoaded`. Grep the channel name to find both ends; there is no registry.

**Styling** is Bootstrap 4 + MDBootstrap, with jQuery plugins initialized imperatively from
`ScriptRunner.runScript()` in `attached()`. Several components depend on that having run.

## Known traps

**Per-screen `isLoading` flags are set manually and leak.** The common failure is a spinner that
never stops, and it is almost always one of two shapes:

1. An early `return` that skips the `isLoading = false` assignment. Example:
   `views/components/partials/atualizacaoDePrecos.ts` → `loadProducts()` sets `isLoading = true`,
   then does nothing when `selectedPriceList` or `selectedClass` is null.
2. A `Promise.all([...])` where one of the promises has no `.catch()`. If it rejects, the `.then()`
   that clears the flag never runs. Same file, `loadData()`.

When touching any screen with `isLoading`, make sure every path — including early returns and
rejections — clears it.

**Backend-driven preconditions are assumed, not checked.** `atualizacaoDePrecos.ts` picks the
default price list with `priceLists.filter(p => p.isDefaultPriceList)` and silently does nothing if
none matches, even though the supplier has exactly one list. Prefer falling back to `[0]`.

**API paths carry backend typos.** `productRepository.alterSuplierProduct` posts to
`alterSuplierProduct` ("Suplier", one `p`) because the backend controller is spelled that way. Don't
"fix" these in isolation.

**`noImplicitAny` is off** and `target` is `es5` with AMD modules. Types are advisory in a lot of
places and `<any>` casts are used freely to attach ad-hoc view state (`item.isEditing`,
`item.oldPrice`). Follow the surrounding style rather than introducing stricter typing piecemeal.

**Enum values are duplicated** between `domain/*.ts` here and `CSZ.Domain/*.cs` in the backend, with
no generation step. Templates sometimes compare against raw numbers (`item.supplierProduct.status != 2`).
Changing an enum means changing both repos.

**`node_modules` is large and `src/` contains a nested `src/`** — scope searches to
`Platform/src/src` to avoid scanning dependencies.
