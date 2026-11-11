/* Shared by the standalone browser templates and Node tests. No dependencies. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.DocumentMoney = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const CURRENCIES = Object.freeze({ PKR: 2, USD: 2, GBP: 2, EUR: 2, AED: 2, SAR: 2, CAD: 2, AUD: 2, JPY: 0, KWD: 3 });
  function decimals(currency) {
    if (!Object.prototype.hasOwnProperty.call(CURRENCIES, currency)) throw new Error("Choose a supported currency.");
    return CURRENCIES[currency];
  }
  function decimalUnits(value, precision, label) {
    const raw = String(value).trim();
    if (!/^\d{1,12}(?:\.\d+)?$/.test(raw)) throw new Error(`${label} must be a non-negative decimal, without commas or exponent notation.`);
    const [whole, fraction = ""] = raw.split(".");
    if (fraction.length > precision) throw new Error(`${label} allows up to ${precision} decimal places.`);
    return BigInt(whole) * (10n ** BigInt(precision)) + BigInt(fraction.padEnd(precision, "0") || "0");
  }
  function money(value, currency = "PKR") { return decimalUnits(value, decimals(currency), "Amount"); }
  function percent(value) {
    const basisPoints = decimalUnits(value === "" ? "0" : value, 2, "Percentage");
    if (basisPoints > 10000n) throw new Error("Percentage must be between 0 and 100.");
    return basisPoints;
  }
  function roundDivide(numerator, denominator) {
    return (numerator + denominator / 2n) / denominator;
  }
  function calculateInvoice(items, discountValue = "0", taxValue = "", currency = "PKR") {
    decimals(currency);
    if (!Array.isArray(items) || items.length < 1 || items.length > 50) throw new Error("Include between 1 and 50 line items.");
    const lineTotals = items.map((item) => {
      const quantity = decimalUnits(item.quantity, 3, "Quantity");
      if (quantity <= 0n) throw new Error("Quantity must be greater than zero.");
      return roundDivide(money(item.unitPrice, currency) * quantity, 1000n);
    });
    const subtotal = lineTotals.reduce((sum, value) => sum + value, 0n);
    const discount = money(discountValue === "" ? "0" : discountValue, currency);
    if (discount > subtotal) throw new Error("Discount cannot exceed the subtotal.");
    const taxable = subtotal - discount;
    const tax = roundDivide(taxable * percent(taxValue), 10000n);
    return { lineTotals, subtotal, discount, taxable, tax, total: taxable + tax };
  }
  function allocateMilestones(total, percentages) {
    if (typeof total !== "bigint" || total < 0n) throw new Error("Total must be non-negative minor units.");
    if (!Array.isArray(percentages) || percentages.length < 1 || percentages.length > 20) throw new Error("Include between 1 and 20 milestones.");
    const rates = percentages.map(percent);
    if (rates.reduce((sum, value) => sum + value, 0n) !== 10000n) throw new Error("Payment milestones must total exactly 100%.");
    const amounts = rates.map((rate) => total * rate / 10000n);
    let remaining = total - amounts.reduce((sum, value) => sum + value, 0n);
    const priority = rates.map((rate, index) => ({ index, remainder: total * rate % 10000n }))
      .sort((a, b) => a.remainder === b.remainder ? a.index - b.index : a.remainder > b.remainder ? -1 : 1);
    for (const { index } of priority) {
      if (!remaining) break;
      amounts[index] += 1n;
      remaining -= 1n;
    }
    return amounts;
  }
  function formatMoney(value, currency = "PKR") {
    const places = decimals(currency);
    const amount = typeof value === "bigint" ? value : money(value, currency);
    const positive = amount < 0n ? -amount : amount;
    const scale = 10n ** BigInt(places);
    const formatted = new Intl.NumberFormat("en-PK", { style: "currency", currency, currencyDisplay: "code", minimumFractionDigits: places, maximumFractionDigits: places })
      .formatToParts(positive / scale).map((part) => part.type === "fraction" ? String(positive % scale).padStart(places, "0") : part.value).join("");
    return `${amount < 0n ? "−" : ""}${formatted}`;
  }
  return Object.freeze({ CURRENCIES, decimals, money, percent, calculateInvoice, allocateMilestones, formatMoney });
});
