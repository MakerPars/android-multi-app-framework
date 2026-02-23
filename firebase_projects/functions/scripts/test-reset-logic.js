const assert = require("node:assert/strict");

const {
  recurrencePeriodMillis,
  isRecurrenceResetDue,
} = require("../lib/dispatchNotifications.js");

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

assert.equal(recurrencePeriodMillis("daily"), DAY_MS);
assert.equal(recurrencePeriodMillis("weekly:friday"), WEEK_MS);
assert.equal(recurrencePeriodMillis("monthly"), null);

assert.equal(isRecurrenceResetDue("daily", undefined, DAY_MS), false);
assert.equal(isRecurrenceResetDue("daily", 0, DAY_MS - 1), false);
assert.equal(isRecurrenceResetDue("daily", 0, DAY_MS), true);

assert.equal(isRecurrenceResetDue("weekly:monday", 0, WEEK_MS - 1), false);
assert.equal(isRecurrenceResetDue("weekly:monday", 0, WEEK_MS), true);

console.log("reset logic tests passed");
