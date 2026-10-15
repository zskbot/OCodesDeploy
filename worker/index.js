const json = (data, status = 200) =>
  new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      if (url.pathname === "/api/health" && request.method === "GET") {
        return json({
          ok: true,
          service: "ocodesdeploy-api",
          version: "0.1.0",
          timestamp: new Date().toISOString()
        });
      }

      if (url.pathname === "/api/projects" && request.method === "GET") {
        if (!env.DB) {
          return json({ ok: false, error: "D1 binding DB chưa được cấu hình." }, 503);
        }
        try {
          const result = await env.DB.prepare(
            "SELECT id, name, repository_url, deployment_url, status, created_at FROM projects ORDER BY created_at DESC LIMIT 100"
          ).all();
          return json({ ok: true, projects: result.results ?? [] });
        } catch {
          return json({ ok: false, error: "Không đọc được dự án. Hãy chạy migration D1." }, 500);
        }
      }

      return json({ ok: false, error: "Not found" }, 404);
    }

    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response("OCodesDeploy assets chưa được cấu hình.", { status: 503 });
  }
};
