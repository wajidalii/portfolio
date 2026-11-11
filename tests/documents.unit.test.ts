import { createRequire } from "node:module";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const money = require("../public/templates/money.js") as {
  money(value: string, currency?: string): bigint;
  formatMoney(value: bigint, currency?: string): string;
  calculateInvoice(items: {quantity: string; unitPrice: string}[], discount?: string, tax?: string, currency?: string): {lineTotals: bigint[]; subtotal: bigint; discount: bigint; taxable: bigint; tax: bigint; total: bigint};
  allocateMilestones(total: bigint, percentages: string[]): bigint[];
};

test("invoice uses exact minor units for fractional prices and quantities", () => {
  const totals = money.calculateInvoice([{quantity:"3",unitPrice:"0.10"}, {quantity:"1.5",unitPrice:"0.15"}]);
  assert.equal(totals.subtotal, BigInt("53")); // 0.30 + 0.225, rounded once per line
  assert.equal(totals.total, BigInt("53"));
});
test("discount precedes an explicitly configured tax and rounds half-up", () => {
  const totals = money.calculateInvoice([{quantity:"2",unitPrice:"95.25"}], "10.50", "17.5");
  assert.equal(totals.subtotal, BigInt("19050"));
  assert.equal(totals.taxable, BigInt("18000"));
  assert.equal(totals.tax, BigInt("3150"));
  assert.equal(totals.total, BigInt("21150"));
  assert.equal(money.calculateInvoice([{quantity:"1",unitPrice:"0.10"}], "0", "5").tax, BigInt("1"));
});
test("no tax is inferred and currencies honor zero/three decimal precision", () => {
  assert.equal(money.calculateInvoice([{quantity:"1",unitPrice:"47500.00"}]).tax, BigInt("0"));
  assert.equal(money.money("123", "JPY"), BigInt("123"));
  assert.equal(money.money("1.234", "KWD"), BigInt("1234"));
  assert.throws(() => money.money("123.00", "JPY"));
  assert.throws(() => money.money("1.234", "PKR"));
});
test("invalid, ambiguous, excessive and negative inputs are rejected", () => {
  for (const value of ["-1", "1e3", "1,000", "Infinity", "NaN", "", "<script>", "1000000000000"]) assert.throws(() => money.money(value));
  assert.throws(() => money.money("1", "XXX"));
  assert.throws(() => money.calculateInvoice([{quantity:"0",unitPrice:"1"}]));
  assert.throws(() => money.calculateInvoice([{quantity:"1.0001",unitPrice:"1"}]));
  assert.throws(() => money.calculateInvoice([{quantity:"1",unitPrice:"1"}], "1.01"));
  assert.throws(() => money.calculateInvoice([{quantity:"1",unitPrice:"1"}], "0", "100.01"));
  assert.throws(() => money.calculateInvoice([]));
  assert.throws(() => money.calculateInvoice(Array(51).fill({quantity:"1",unitPrice:"1"})));
});
test("large amounts stay exact beyond floating-point safe integer precision", () => {
  const totals = money.calculateInvoice([{quantity:"999999999999",unitPrice:"999999999999.99"}]);
  assert.equal(totals.total, BigInt("99999999999899000000000001"));
  assert.ok(money.formatMoney(totals.total).endsWith(".01"));
});
test("proposal defaults and fractional milestones sum to precisely the agreed total", () => {
  assert.deepEqual(money.allocateMilestones(BigInt("9500000"), ["50", "30", "20"]), [BigInt("4750000"),BigInt("2850000"),BigInt("1900000")]);
  assert.deepEqual(money.allocateMilestones(BigInt("1"), ["50", "50", "0"]), [BigInt("1"),BigInt("0"),BigInt("0")]);
  assert.deepEqual(money.allocateMilestones(BigInt("100"), ["33.33", "33.33", "33.34"]), [BigInt("33"),BigInt("33"),BigInt("34")]);
  for (let total = BigInt("0"); total < BigInt("100"); total++) {
    const amounts = money.allocateMilestones(total, ["33.33", "33.33", "33.34"]);
    assert.equal(amounts.reduce((a,b)=>a+b,BigInt("0")), total);
    assert.ok(amounts.every(amount=>amount>=BigInt("0")));
  }
  assert.throws(() => money.allocateMilestones(BigInt("100"),["50","40"]));
});
test("standalone templates include print fallback and never include remote scripts or autosave", () => {
  for (const name of ["proposal", "invoice"]) {
    const html = readFileSync(new URL(`../public/templates/${name}.html`, import.meta.url), "utf8");
    assert.match(html, /Print \/ Save PDF/);
    assert.match(html, /there is no autosave/);
    assert.match(html, /<noscript>/);
    assert.doesNotMatch(html, /<script[^>]+src="https?:/);
    assert.match(html, /noindex, nofollow/);
  }
  const script = readFileSync(new URL("../public/templates/document.js",import.meta.url),"utf8");
  assert.doesNotMatch(script, /innerHTML|localStorage|sessionStorage|fetch\(/);
});
