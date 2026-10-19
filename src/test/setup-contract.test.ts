import { describe, expect, it, vi } from "vitest";

describe("vitest setup fetch contract", () => {
	it("installs a fail-closed fetch stub that rejects unexpected calls", async () => {
		await expect(globalThis.fetch("https://example.com")).rejects.toThrow(
			/Unexpected fetch call in test/,
		);
	});

	it("allows a test to stub fetch with a resolving mock", async () => {
		const fetchMock = vi.fn().mockResolvedValue(new Response("{}"));
		vi.stubGlobal("fetch", fetchMock);

		const response = await globalThis.fetch("https://example.com");

		expect(fetchMock).toHaveBeenCalledWith("https://example.com");
		expect(response).toBeInstanceOf(Response);
		await expect(response.json()).resolves.toEqual({});

		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it("restores the fail-closed stub after a stubbing test", async () => {
		await expect(globalThis.fetch("https://example.com")).rejects.toThrow(
			/Unexpected fetch call in test/,
		);
	});
});
