import { test } from "node:test";
import assert from "node:assert/strict";
import { consultationBookingUrl } from "../src/lib/services/consultation";
import { conversionPayload, conversionEvents } from "../src/lib/services/analytics";

test("20-minute consultation is unconfigured by default, not a fabricated event", () => {
  assert.equal(consultationBookingUrl(""), null);
  assert.equal(consultationBookingUrl("javascript:alert(1)"), null);
  assert.equal(consultationBookingUrl("https://cal.com.attacker.test/event"), null);
  assert.equal(consultationBookingUrl("https://user:pass@cal.com/owner/event"), null);
  assert.equal(consultationBookingUrl("https://cal.com/"), null);
  assert.equal(consultationBookingUrl("https://cal.com/owner/discovery-20"), "https://cal.com/owner/discovery-20");
  assert.equal(consultationBookingUrl("https://calendly.com/owner/discovery"), "https://calendly.com/owner/discovery");
});
test("analytics only returns allowlisted non-PII event names and broad source", () => {
  for (const event of conversionEvents) {
    const result = conversionPayload(event, "a-private-email@example.com");
    assert.deepEqual(Object.keys(result!), ["event", "source"]);
    assert.equal(result!.source, "services");
  }
  assert.equal(conversionPayload("<script>"), null);
  assert.deepEqual(conversionPayload("inquiry_submitted_successfully", "website"), { event: "inquiry_submitted_successfully", source: "website" });
});
