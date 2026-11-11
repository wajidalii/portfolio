(function () {
  "use strict";
  const M = window.DocumentMoney;
  const documentType = document.body.dataset.document;
  const currency = document.getElementById("currency");
  const error = document.getElementById("document-error");
  const printButton = document.getElementById("print-document");
  const today = new Date();
  const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  document.querySelectorAll("[data-today]").forEach((input) => { input.value = localDate; });
  function resizeTextarea(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 2}px`;
  }
  function refreshTextareas() { document.querySelectorAll("textarea").forEach(resizeTextarea); }
  function show(id, value) { document.getElementById(id).textContent = M.formatMoney(value, currency.value); }
  function update() {
    try {
      if (documentType === "proposal") {
        const total = M.money(document.getElementById("project-price").value, currency.value);
        const rates = Array.from(document.querySelectorAll(".milestone-percent")).map((input) => input.value);
        const amounts = M.allocateMilestones(total, rates);
        amounts.forEach((amount, index) => show(`milestone-${index + 1}`, amount));
        show("proposal-total", total);
      } else {
        const rows = Array.from(document.querySelectorAll("[data-line-item]"));
        const items = rows.map((row) => ({ quantity: row.querySelector("[data-quantity]").value, unitPrice: row.querySelector("[data-price]").value }));
        const totals = M.calculateInvoice(items, document.getElementById("discount").value, document.getElementById("tax-rate").value, currency.value);
        rows.forEach((row, index) => { row.querySelector("output").textContent = M.formatMoney(totals.lineTotals[index], currency.value); });
        for (const key of ["subtotal", "tax", "total"]) show(`invoice-${key}`, totals[key]);
        show("invoice-discount", totals.discount);
      }
      error.textContent = "";
      printButton.disabled = false;
    } catch (problem) {
      error.textContent = problem instanceof Error ? problem.message : "Check the document amounts.";
      printButton.disabled = true;
      // Never leave a previous, now incorrect total visible beside invalid inputs.
      document.querySelectorAll("output").forEach((output) => { output.textContent = "—"; });
    }
  }
  document.addEventListener("input", (event) => {
    if (event.target instanceof HTMLTextAreaElement) resizeTextarea(event.target);
    update();
  });
  document.addEventListener("change", update);
  printButton.addEventListener("click", () => { update(); if (!error.textContent) { refreshTextareas(); window.print(); } });
  window.addEventListener("beforeprint", refreshTextareas);
  window.addEventListener("resize", refreshTextareas);
  if (documentType === "invoice") {
    let nextItem = 2;
    document.getElementById("add-item").addEventListener("click", () => {
      const rows = document.querySelectorAll("[data-line-item]");
      if (rows.length >= 50) { error.textContent = "A maximum of 50 line items is supported."; return; }
      const clone = document.getElementById("item-template").content.cloneNode(true);
      const row = clone.querySelector("tr");
      row.querySelectorAll("[data-item-label]").forEach((input) => input.setAttribute("aria-label", `${input.dataset.itemLabel} ${nextItem}`));
      row.querySelector("button").setAttribute("aria-label", `Remove line item ${nextItem}`);
      row.querySelector("output").setAttribute("aria-label", `Line item ${nextItem} amount`);
      nextItem += 1;
      document.getElementById("invoice-items").append(clone);
      update();
      row.querySelector("input").focus();
    });
    document.getElementById("invoice-items").addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove]");
      if (!button) return;
      if (document.querySelectorAll("[data-line-item]").length <= 1) { error.textContent = "Keep at least one line item."; return; }
      button.closest("tr").remove();
      update();
      document.getElementById("add-item").focus();
    });
  }
  update();
  refreshTextareas();
})();
