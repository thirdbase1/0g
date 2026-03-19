import { expect, test, describe, beforeAll, afterAll } from "bun:test";
import { Server, Get, Post, Group } from "../src/nexa";

describe("Nexa Framework", () => {
  let server: ReturnType<typeof Server>;

  beforeAll(() => {
    server = Server({ port: 3001 }, [
      Get('/', () => "Hello"),
      Group('/group', [
        Get('/item', () => ({ ok: true }))
      ]),
      Post('/echo', async (req) => {
        const body = await req.json();
        return body;
      })
    ]);
  });

  afterAll(() => {
    server.stop(true);
  });

  test("GET /", async () => {
    const res = await fetch("http://localhost:3001/");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe("Hello");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  test("GET /group/item", async () => {
    const res = await fetch("http://localhost:3001/group/item");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });

  test("POST /echo", async () => {
    const payload = { msg: "test" };
    const res = await fetch("http://localhost:3001/echo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.msg).toBe("test");
  });

  test("404 Not Found", async () => {
    const res = await fetch("http://localhost:3001/not-exist");
    expect(res.status).toBe(404);
  });
});
