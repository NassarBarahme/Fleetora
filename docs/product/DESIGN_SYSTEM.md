# Fleetora design law — UI-00

Binding for all web UI. Owner approved Phase D1, 2026-11-28 (OD-22); date/time rules are OD-21. This file is the sole design authority. Archived design references are historical. Product rules, permissions, tenant ownership, transitions and persistence remain backend concerns. D1 changes shared foundations and their consumers; individual workflow redesigns belong to D2+.

## Brand allocation (OD-22)

Use approximately **60% light surfaces / 30% structural navy / 10% signature amber** as a visual hierarchy, not a per-screen pixel quota. Surfaces carry working content. Navy frames navigation, header and headings. Amber is scarce: only the **one primary action on the active page**, active navigation indicator and key highlights. A modal is the active task while open; its background is inert. Amber never represents errors, warnings, success or general links. Text on amber is always navy, never white. Generic buttons default to secondary; opt into `variant="primary"` deliberately.

### Exact implemented tokens

`frontend/app/globals.css` owns CSS variables and Tailwind v4 `@theme inline` aliases. Use semantic utility names (`bg-surface`, `text-foreground`, `gap-4`) or CSS variables, never literal feature colors, fonts or arbitrary spacing. Built-in spacing utilities derive from the shared quarter-rem scale. Opacity modifiers may soften decorative borders; do not reduce text contrast.

| CSS variable | Value | Use |
| --- | --- | --- |
| `--background`, `--surface-secondary`, `--muted`, `--secondary` | `#F5F7FA` | Page, subdued sections, secondary controls |
| `--surface`, `--sidebar-foreground` | `#FFFFFF` | Cards; readable ink on navy |
| `--brand-navy`, `--sidebar-navy`, `--foreground`, `--secondary-foreground` | `#0B1F33` | Structure, headings and body ink |
| `--brand-navy-hover`, `--accent-foreground` | `#16324F` | Navy hover/active background; dark link ink |
| `--sidebar-muted` | `#9FB3C8` | Muted text on navy |
| `--sidebar-border` | `#304559` | Decorative divisions on navy |
| `--primary`, `--action-background` | `#F5A524` | Signature primary action and active nav indicator |
| `--primary-hover`, `--primary-active` | `#E08E0B` | Amber action hover/pressed |
| `--primary-foreground` | `#0B1F33` | Required amber ink |
| `--primary-subtle`, `--accent` | `#EAF0F6` | Neutral navy-tinted selection surface |
| `--primary-soft` | `#DCE6F0` | Stronger neutral selection surface |
| `--muted-foreground`, `--control-border` | `#526579` | Secondary text on light surfaces; identifiable controls |
| `--border`, `--input` | `#E3EAF0` | Decorative divisions, not sole control boundaries |
| `--border-strong`, `--form-border` | `#CBD5E1` | Stronger decorative divisions |
| `--ring` | `#3273B5` | Visible keyboard focus on light and navy surfaces |
| `--success` / `--success-background` / `--success-border` | `#166534` / `#EAF6EF` / `#C5E5D1` | Successful state |
| `--warning` / `--warning-background` / `--warning-border` | `#854D0E` / `#FBF3E7` / `#EED9B7` | Attention; distinct from signature amber |
| `--destructive`, `--danger-foreground` / `--danger-background` / `--danger-border` | `#B42332` / `#FCEEEF` / `#F2C9CD` | Failure, rejection, revocation |
| `--destructive-foreground` / `--danger-hover` | `#FFFFFF` / `#8E1C28` | Danger action ink / hover |
| `--in-progress` / `--in-progress-background` / `--in-progress-border` | `#1E40AF` / `#EDF4FB` / `#C9DDF1` | Informational/in-progress state |
| Neutral status | `--muted-foreground` / `--muted` / `--border-strong` | Inactive or unknown state |
| `--overlay` | `#0B1F338C` | Dialog backdrop |
| `--shadow-color`, `--shadow-elevated-color` | `#0B1F3314`, `#0B1F3324` | Restrained elevation |
| `--map-background` | `#EDF1F5` | Map chrome fallback |

The vector basemap's cartographic land/water/road colors are map data styling, separate from UI/status tokens. Resolved MapLibre paint tokens live only in `components/ui/map-tokens.ts` because MapLibre cannot resolve CSS variables: background #F5F3EE, park #CDE5B5, wood #BDD8AA, grass #D5E8BF, wetland #C9E0CD, residential #EFEDE8, water #A9D5EF, building #E4DFD7, road casing #C9C7C1, road #FFFFFF. Controls and popups use the UI system. Never use a basemap color as a product action/status token.

## Typography, spacing and geometry

Always load **Inter** (English) and **Noto Sans Arabic** (Arabic) through root `next/font`, self-hosted by Next. `--font-ui` and `--font-arabic` select the family. Keep both mounted when changing language; do not load a font only after the switch. Use `font-sans`/inherited typography; no feature font stacks.

| Token / utility | Size | Typical use |
| --- | --- | --- |
| `--type-xs` / `text-xs` | 12px | Metadata, status, table headings |
| `--type-sm` / `text-sm` | 14px | Body, controls, dense operational data |
| `--type-base` / `text-base` | 16px | Section title, mobile text inputs |
| `--type-lg` / `text-lg` | 18px | Dialog title |
| `--type-xl` / `text-xl` | 20px | Shared page heading |
| `--type-2xl` / `text-2xl` | 24px | Existing page headings |
| `--type-3xl` / `text-3xl` | 30px | Focused account/auth headings only |

Weights: normal 400, medium 500, semibold 600, bold 700 (`--weight-*`). Body line height at least 1.4; Arabic paragraphs typically 1.7–1.8. Do not force uppercase/letter-spacing on Arabic. Tabular digits align operational data; date values remain Latin in both locales.

Spacing: quarter-rem base (`--spacing`); `--space-0`, `--space-0-5`, `--space-1`, `--space-1-5`, `--space-2`, `--space-2-5`, `--space-3`, `--space-4`, `--space-5`, `--space-6`, `--space-8`, `--space-10`, `--space-11`, `--space-12`, `--space-16`, `--space-20`, `--space-24` correspond to 0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 44, 48, 64, 80, 96px. Typical control gap 8–12px, section gap 24px, card inset 20–24px. CSS modules use these variables. Layout dimensions may have named component tokens (e.g. `--size-sidebar` 248px); do not encode random margins to position content.

Additional shared scale values are `--space-9` 36px, `--space-13` 52px and `--space-14` 56px. Named map geometry tokens preserve existing panel/editor widths (320/360px), popup minimum (180px), control offsets (76/108px) and viewport reserves (150/100px); `--size-workspace-name-max` is 288px. These are layout dimensions, not new workflow composition.

Radii: `rounded-sm` 6px, `rounded-md` / `--radius` 8px, `rounded-lg` 10px, `rounded-xl` 12px, `rounded-full` for dots/badges only. Cards use a subtle border, no decorative gradients. Motion uses `--motion-default` 180ms and `--motion-easing`; respect reduced-motion preferences.

## Shared components (`frontend/components/ui`)

| Component | When to use | When not to use |
| --- | --- | --- |
| Button | `primary` amber for one principal action; `secondary` default, `outline` for secondary emphasis, `ghost` for tertiary, `danger`/`destructive` for destructive actions. `asChild` preserves link semantics. Default type is button; legacy `default` aliases primary and `destructive` aliases danger. | Never a div with click handler, white text on amber, or multiple competing primary actions. |
| StatusBadge | One `status-map.ts` for every company, merchant, parcel, driver and invitation state. Caller supplies the localized label as children. Text plus dot; unknown states get neutral. | Never infer permission/transition from tone; never duplicate color mapping in a feature. |
| Card | Bounded content section, inherited surface and spacing. | Do not wrap every element or nest decorative cards. |
| PageHeader | Title, optional hint, one `primaryAction` element and secondary children. | Do not add a second competing page heading or several primary buttons. |
| EmptyState | Title, helpful hint and an authorized action (create, reset filters, return, or refresh). | Never claim a failed fetch is an empty list; never offer an unauthorized creation action. |
| LoadingState | Polite loading announcement and reduced-motion-aware skeleton. | Never a fake successful result or persistent blocking spinner after failure. |
| ErrorState | Explain failure and recovery; optional authorized retry. | Never expose raw infrastructure messages or suggest retrying an uncertain write blindly. |
| ConfirmDialog | Destructive confirmation with explicit verb/object, consequence, cancel first, focus trap/restore, disabled pending actions. | Never for harmless routine actions; do not close/re-enable an unresolved write automatically. |
| Toast | Mutation feedback, polite success/info or alert failure, explicit dismissal. | Never the only place for required form errors; never steal focus or auto-dismiss necessary instructions. |
| Select | Short status/role/action/currency enums. Base UI popup supports keyboard/typeahead, selected label, disabled and required state, hidden form value and reset. | Never existing-record search. Never pair a search input and native select. |
| DropdownMenu | Contextual commands and language choices; use its Radix keyboard/focus and radio selection semantics. | Never use a command menu as a form Select or a searchable record Combobox. |
| Combobox | UX-01 existing-record lookup; draft stays local, commit on selection/clear; debounced, authenticated, tenant-scoped suggestions. | Never navigate or remount on typing, invent results, or replace it with Select. |
| Tabs / TabList / Tab / TabPanel | Related panels with Base UI keyboard activation, selected semantics and panel association. | Never hide unrelated routes behind local tabs; route navigation stays links. |
| Table / TableHead / TableCell | Tabular records, semantic headers, named scroll region, contained overflow and keyboard focus. | Never use tables for page layout or let dense columns overflow the whole page. |
| Input / Label / LocalizedDateInput | Labeled external input with visible focus, invalid state and field help. Date input displays OD-21 and submits the original ISO contract. | Never placeholders instead of labels or localized date strings in API payloads. |

Feature adapters may preserve existing data/error contracts and localization while composing these primitives. They must not define alternative palettes or date formatters. D1 does not change permissions, endpoints or workflow semantics.

### StatusBadge map

All tone values live in `components/ui/status-map.ts`; `StatusBadge` alone maps tones to semantic CSS classes. New statuses must be reviewed here first. Neutral fallback displays supplied text and never invents a domain state.

| Tone | Status keys |
| --- | --- |
| Success | ACTIVE, APPROVED, ACCEPTED, DELIVERED, PAID, RETURNED_TO_MERCHANT, COMPLETED, VERIFIED_DELIVERY, VERIFIED_RETURN_HANDOFF |
| Warning | PENDING, INVITED, ON_BREAK, EXPIRED, ON_HOLD, RESCHEDULED, HIGH, RETURN_IN_PROGRESS, RETURNED, RETURNED_TO_WAREHOUSE, GRACE |
| Danger | SUSPENDED, REJECTED, FAILED, FAILED_DELIVERY, CANCELLED, REVOKED, URGENT, DAMAGED, ACCESS_REVOKED |
| Info | RECEIVED_FROM_MERCHANT, AT_WAREHOUSE, ASSIGNED, OUT_FOR_DELIVERY, PICKED_UP, READY_FOR_DISPATCH, FINALIZED, ISSUED |
| Neutral | OFFLINE, INACTIVE, DRAFT, CREATED, NORMAL, USED, OFFBOARDED, NONE; unknown keys |

## Shell and responsive behavior

Navy sidebar and header. Active navigation uses navy hover background, readable white label and amber logical-start indicator. Muted navy text uses `--sidebar-muted`. Scrollable navigation must expose an overflow hint (scroll shadows and scrollbar), retain access to account controls and reveal the current route. At mobile sizes use the existing modal navigation with close button, Escape, focus containment and restored trigger focus. Header language and logout remain readable on navy. The platform console shares tokens and shows the **Fleetora Platform** badge; identity/role boundaries remain unchanged.

Verify English/LTR and Arabic/RTL on desktop and **390px**. Use logical start/end and inline/block spacing. Keep record names wrapping, forms usable and touch targets at least 40px (prefer 44px). Tables scroll within their named region. Never solve overflow by hiding essential content.

Keep company context visible in the mobile header (truncate long names with their full title available). At narrow widths the language control shows `EN` / `ع`; wider headers show the globe and full language name. Its accessible name and menu remain localized. Keep logout readable alongside it.

## Copy and RTL

Buttons use **verb + object** where the object is not already unambiguous: Create company, Save parcel, Revoke invitation. Destructive confirmation names the record and consequence. Errors explain **what happened + what to do**; uncertain writes require checking the record before retry. Empty states explain the absence and offer an authorized action. Use existing AR/EN translation conventions, no technical implementation details or invented operational facts.

Direction follows the root locale. Use start/end alignment and logical margins/padding. Do not mirror logos or numeric/date sequences. Isolate mixed identifiers/phones with `bdi`/LTR. Keep date input order LTR and labels/help localized. Ensure icon-only controls have accessible names in both languages.

## Dates and times (OD-21)

Use `lib/date-time.ts`: `formatDate`, `formatTime`, `formatDateTime`, `parseDateInput`. **dd/MM/yyyy**, Gregorian calendar, **Latin 0–9 in both languages**; **12-hour** time with **AM/PM** in English and **ص/م** in Arabic. Example: `28/11/2026, 1:05 PM` / `28/11/2026, 1:05 م`. Inputs display the same order/periods and submit ISO date/local-datetime values; Arabic/Persian digit input is normalized to Latin. Reject impossible dates rather than rolling into another month. Missing/invalid display values use `—`.

Preserve the existing time-zone contract. Pass the API's explicit zone where available (e.g. dashboard); otherwise use the existing browser-local zone. A date-only calendar value never shifts with timezone. Relative freshness labels remain relative; absolute timestamps and tooltips use the shared formatter. Never implement a feature-local `Intl.DateTimeFormat` or locale date conversion.

## Accessibility and verification

WCAG AA: text contrast **4.5:1** (large text **3:1**), meaningful control boundaries/focus indicators **3:1**. Check actual computed foreground/background combinations, including hover and inverse header controls. All semantic badges use dark text on a soft background. Amber action text must remain navy in every state. Use a visible 2px focus ring with offset, including keyboard navigation, dialogs, selects, tabs and scrollable tables; never remove focus without a replacement. Status must have text, not color alone. Associate labels, errors and hints. Preserve native form validation, required fields and submission contracts. Dialogs trap focus, cancel safely and return focus; pending actions prevent duplicates. Respect reduced motion.

Required D1 evidence: browser + harness + action suites, typecheck and lint; actual AR/EN desktop/390px screenshots **only under `.task-work/`**. Mock-backed browser checks prove frontend behavior, not live backend integration. Record code/test coverage in TRACEABILITY.md and distinguish any unverified condition.
