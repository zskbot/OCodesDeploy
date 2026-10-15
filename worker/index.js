const json = (data, status = 200) =>
  new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "content-type, authorization"
    }
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, OPTIONS",
        "access-control-allow-headers": "content-type, authorization",
        "access-control-max-age": "86400"
      }});
    }

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
};
