export interface Env {
  OTHER_APPS_JSON_URL: string;
  AUDIO_BUCKET: R2Bucket;
}

type AudioManifestItem = {
  key: string;
  url: string;
  size?: number;
  etag?: string;
  uploaded?: string;
};

type AudioManifest = {
  generatedAt: string;
  baseAudioUrl: string;
  packageAudio: Record<string, string>;
  files: AudioManifestItem[];
};

const PACKAGE_AUDIO: Record<string, string> = {
  "com.parsfilo.amenerrasulu": "amenerrasulu.mp3",
  "com.parsfilo.ayetelkursi": "ayetelkursi.mp3",
  "com.parsfilo.bereketduasi": "bereketduasi.mp3",
  "com.parsfilo.esmaulhusna": "esmaulhusna.mp3",
  "com.parsfilo.fetihsuresi": "fetihsuresi.mp3",
  "com.parsfilo.insirahsuresi": "insirahsuresi.mp3",
  "com.parsfilo.ismiazamduasi": "ismiazamduasi.mp3",
  "com.parsfilo.kenzularsduasi": "kenzularsduasi.mp3",
  "com.parsfilo.namazsurelerivedualarsesli": "fatiha.mp3",
  "com.parsfilo.nazarayeti": "nazarayeti.mp3",
  "com.parsfilo.vakiasuresi": "vakiasuresi.mp3",
  "com.parsfilo.yasinsuresi": "yasinsuresi.mp3",
};

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300",
      ...headers,
    },
  });
}

async function proxyJson(url: string): Promise<Response> {
  const upstream = await fetch(url, { cf: { cacheEverything: true, cacheTtl: 300 } });
  if (!upstream.ok) {
    return json({ error: `Upstream failed: ${upstream.status}` }, 502);
  }
  const body = await upstream.text();
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}

async function buildAudioManifest(requestUrl: string, env: Env): Promise<AudioManifest> {
  const files: AudioManifestItem[] = [];
  let cursor: string | undefined;

  do {
    const listed = await env.AUDIO_BUCKET.list({ cursor, limit: 1000 });
    for (const obj of listed.objects) {
      if (!obj.key.toLowerCase().endsWith(".mp3")) continue;
      files.push({
        key: obj.key,
        url: `${requestUrl.replace(/\/$/, "")}/api/audio/${encodeURIComponent(obj.key)}`,
        size: obj.size,
        etag: obj.etag,
        uploaded: obj.uploaded?.toISOString(),
      });
    }
    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor);

  files.sort((a, b) => a.key.localeCompare(b.key));

  return {
    generatedAt: new Date().toISOString(),
    baseAudioUrl: `${requestUrl.replace(/\/$/, "")}/api/audio`,
    packageAudio: PACKAGE_AUDIO,
    files,
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({ ok: true, service: "contentapp-content-api" });
    }

    if (url.pathname === "/api/other-apps") {
      return proxyJson(env.OTHER_APPS_JSON_URL);
    }

    if (url.pathname === "/api/audio-manifest") {
      const manifest = await buildAudioManifest(url.origin, env);
      return json(manifest, 200, { "cache-control": "public, max-age=300" });
    }

    if (url.pathname.startsWith("/api/audio/")) {
      const key = decodeURIComponent(url.pathname.replace("/api/audio/", ""));
      if (!key || key.includes("..")) return json({ error: "Invalid audio key" }, 400);

      const object = await env.AUDIO_BUCKET.get(key);
      if (!object) return json({ error: "Not found" }, 404);

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("cache-control", "public, max-age=31536000, immutable");
      if (!headers.has("content-type")) {
        headers.set("content-type", "audio/mpeg");
      }

      return new Response(object.body, { headers });
    }

    return json({ error: "Not found" }, 404);
  },
};
