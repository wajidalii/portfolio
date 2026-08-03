// Static, owner-curated FAQ (see ARCHITECTURE.md content model). Written
// short, factual, self-contained per the GEO requirement — quotable
// directly by an AI answer engine. Mirrored as FAQPage JSON-LD in the SEO
// phase. The GEO phase adds identity-establishing entries ("Who is Wajid
// Ali?" etc.) on top of these, which match the design spec as-is.

export const faqs = [
  {
    q: "What kind of roles are you looking for?",
    a: "Senior or staff software engineering roles on platform, infrastructure, or AI product teams — full-time remote, or on-site with relocation and sponsorship. I'm most useful where a system needs to scale and the team wants someone accountable for it, not just contributing to it.",
  },
  {
    q: "Which regions and time zones do you work in?",
    a: "Open to the Gulf (UAE, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain), Pakistan, USA, UK, and Malaysia. Based around UTC+4/+5, and I've worked with teams from UTC-8 to UTC+8 with 4+ overlap hours.",
  },
  {
    q: "What does “AI-first” mean in your work?",
    a: "Treating the model as a component with a contract: inspectable retrieval, structured outputs, evals running in CI, explicit cost and latency budgets per request, and a defined fallback when the model is wrong. Not a chatbot bolted onto a CRUD app.",
  },
  {
    q: "How senior is “senior” here?",
    a: "I've led teams of 3–6 engineers, owned production on-call, authored the architecture decisions for revenue-critical domains, and mentored 12 engineers. Scope over title — happy to walk through specific system designs on a call.",
  },
];
