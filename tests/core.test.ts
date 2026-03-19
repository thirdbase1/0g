import { expect, test, describe, beforeAll, afterAll } from "bun:test";
import { start } from "../src/s4";

describe("S⁴ Framework", () => {
  let server: ReturnType<typeof start>;

  beforeAll(() => {
    // Mimic the JSX compilation output since bun test doesn't run via the custom jsx-runtime
    // by default inside a test file without specifically naming it .tsx or configuring bunfig
    const app = {
      type: "server",
      props: {
        port: 3001,
        children: [
          {
            type: "get",
            props: {
              path: "/",
              handler: () => "Hello"
            }
          },
          {
            type: "group",
            props: {
              path: "/group",
              children: [
                {
                  type: "get",
                  props: {
                    path: "/item",
                    handler: () => ({ ok: true })
                  }
                }
              ]
            }
          },
          {
            type: "post",
            props: {
              path: "/echo",
              handler: async (req: Request) => {
                const body = await req.json();
                return body;
              }
            }
          }
        ]
      }
    };

    server = start(app);
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
