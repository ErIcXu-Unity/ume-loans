import { describe, it, expect } from "vitest";
import {
  getValidTransitions,
  isValidTransition,
  isTerminalStatus,
} from "@/lib/status-machine";

describe("getValidTransitions", () => {
  it("Pending can only move to Under Review", () => {
    expect(getValidTransitions("Pending")).toEqual(["Under Review"]);
  });

  it("Under Review can move to Approved or Rejected", () => {
    expect(getValidTransitions("Under Review")).toEqual(["Approved", "Rejected"]);
  });

  it("Approved has no valid transitions", () => {
    expect(getValidTransitions("Approved")).toEqual([]);
  });

  it("Rejected has no valid transitions", () => {
    expect(getValidTransitions("Rejected")).toEqual([]);
  });
});

describe("isValidTransition", () => {
  it("Pending -> Under Review is valid", () => {
    expect(isValidTransition("Pending", "Under Review")).toBe(true);
  });

  it("Under Review -> Approved is valid", () => {
    expect(isValidTransition("Under Review", "Approved")).toBe(true);
  });

  it("Under Review -> Rejected is valid", () => {
    expect(isValidTransition("Under Review", "Rejected")).toBe(true);
  });

  it("Pending -> Approved is invalid (cannot skip steps)", () => {
    expect(isValidTransition("Pending", "Approved")).toBe(false);
  });

  it("Pending -> Rejected is invalid (cannot skip steps)", () => {
    expect(isValidTransition("Pending", "Rejected")).toBe(false);
  });

  it("Approved -> Under Review is invalid (cannot go backwards)", () => {
    expect(isValidTransition("Approved", "Under Review")).toBe(false);
  });

  it("Rejected -> Pending is invalid (cannot go backwards)", () => {
    expect(isValidTransition("Rejected", "Pending")).toBe(false);
  });

  it("Approved -> Rejected is invalid (terminal state)", () => {
    expect(isValidTransition("Approved", "Rejected")).toBe(false);
  });
});

describe("isTerminalStatus", () => {
  it("Approved is terminal", () => {
    expect(isTerminalStatus("Approved")).toBe(true);
  });

  it("Rejected is terminal", () => {
    expect(isTerminalStatus("Rejected")).toBe(true);
  });

  it("Pending is not terminal", () => {
    expect(isTerminalStatus("Pending")).toBe(false);
  });

  it("Under Review is not terminal", () => {
    expect(isTerminalStatus("Under Review")).toBe(false);
  });
});
