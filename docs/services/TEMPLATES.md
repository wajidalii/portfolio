# Editable proposals and invoices

The document templates are standalone, dependency-free browser documents:

- `/templates/proposal.html`
- `/templates/invoice.html`

They do not require admin access, database migrations, email configuration or a
running Next.js application. The same relative CSS and classic JavaScript files
work when downloaded together. No external fonts, scripts, trackers, network APIs
or browser storage are used. Typed details stay in the open tab; **there is no
autosave**. Closing or reloading loses changes. Create an exported PDF before
closing, and keep your own private editable copy if needed.

For a local preview without Next.js:

```bash
python -m http.server 8091 --bind 127.0.0.1 --directory public/templates
```

Open `http://127.0.0.1:8091/proposal.html` or `invoice.html`. A local HTTP server
also works in managed browsers whose administrator disables `file://` pages.

## Proposal

1. Set the client name/company, reference, dates and validity date.
2. Replace the overview, business objectives, scope/deliverables, timeline,
   revision policy, exclusions and acceptance terms with the agreed project.
3. Enter the quoted price and currency. The starting text is a **sample draft**,
   not a binding offer, legal template or commitment to every project scope.
4. Set the payment descriptions and percentages. Defaults are 50% upfront,
   30% at an agreed review milestone, and 20% on acceptance/handover. All are
   configurable; the percentages must total exactly 100%.
5. Review the agreement with the client, then use **Print / Save PDF**. Select
   A4 and disable the browser's optional URL/date headers and footers. The default
   content prints to one page in Chromium. Longer scopes naturally need more
   pages; do not shrink important terms until they become unreadable.
6. The signature lines are for signed approval outside this template; they are
   not an electronic-signature or acceptance workflow.

The public identity is Wajid Ali, `wajidalii.me@gmail.com`, `wajidali.dev`. Update
that public source copy if business identity changes. No legal registration,
address, tax number or bank account details are invented.

## Invoice

1. Set the reference, issue/due dates, sender and client billing information,
   project reference, currency and payment status.
2. Edit the first service line; use **Add line item** for more (up to 50).
   Quantities accept at most three decimal places and must exceed zero. Unit
   prices are non-negative and use the currency's minor-unit precision.
3. A discount is an explicit amount in the chosen currency, not a percentage,
   and cannot exceed the subtotal. Optional tax is an explicit percentage on the
   subtotal after discount. Blank means no tax applied. Confirm legal applicability
   and any required invoice wording before entering a rate or issuing a document.
4. Add private payment instructions only in your private local document. Never
   put account numbers, payment credentials or customer data in this repository.
5. Review totals and terms, then print/save PDF. Payment status is a manual label;
   it is not reconciled with a bank, ledger, billing service or payment gateway.

PKR is the default. Supported options: PKR, USD, GBP, EUR, AED, SAR, CAD, AUD,
JPY (zero decimals), KWD (three decimals); others use two decimals. Changing the
currency **does not perform foreign-exchange conversion**. Update the agreed
values and precision manually when changing currencies.

## Calculation and privacy guarantees in the implementation

`money.js` uses exact `BigInt` decimal parsing and minor units, never binary
floating-point for monetary arithmetic. Line extensions round half-up to minor
units; tax rounds once on the discounted subtotal. Milestones use a largest-
remainder allocation so their sum exactly equals the price, including tiny totals
and fractional percentages. Display formatting preserves large integers exactly.
Invalid inputs clear prior totals and disable the custom print button. Native
browser printing can bypass that control, so always review validation errors.

The templates use value/textContent APIs rather than HTML injection. The shared
scripts do not save, transmit or log document contents. Save PDFs to a private
location; do not upload completed client documents as public site assets.

## Verification performed

- `npx tsx --test tests/documents.unit.test.ts`: **7 tests passed**, covering fractional
  prices/quantities, tax/discount order, currency precision, invalid/negative inputs,
  very large amounts, milestone remainder allocation and local-only behavior.
- `npx eslint public/templates tests/documents.unit.test.ts`: passed.
- System Chromium 156 + Playwright: both templates loaded from a standalone local
  HTTP server with no external requests and no page errors; editable values,
  add/remove line items, invalid tax/milestone validation and print state checked.
- No horizontal overflow at 320, 375, 390, 768, 1024, 1440 and 1920 CSS px.
- axe WCAG 2 A/AA, 2.1 AA and 2.2 AA tags: **zero violations** in both templates.
  Automated axe checks do not prove complete WCAG conformance.
- PDF generation: default proposal and invoice each exported as **one A4 page**.
- Direct `file://` navigation was blocked by this environment's Chromium policy
  (`ERR_BLOCKED_BY_ADMINISTRATOR`); the code uses local classic scripts/relative
  paths, but direct file navigation was not verified in this managed browser.
