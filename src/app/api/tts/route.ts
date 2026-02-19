import { NextRequest, NextResponse } from "next/server";

const VOICE_CONFIG: Record<
  string,
  { voiceId: string; stability: number; similarity_boost: number; style: number }
> = {
  xiaoli: {
    voiceId: "XB0fDUnXU5powFXDhCwa",
    stability: 0.3,
    similarity_boost: 0.75,
    style: 0.9,
  },
  wangbeng: {
    voiceId: "iP95p4xoKVk53GoZ742B",
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.6,
  },
  aizhong: {
    voiceId: "IKne3meq5aSn9XLyUdCD",
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0.7,
  },
  guailaoshi: {
    voiceId: "pqHfZKP75CvOlQylNhV4",
    stability: 0.4,
    similarity_boost: 0.85,
    style: 0.6,
  },
  xiaohei: {
    voiceId: "pFZP5JQG7iQjIQuC4Bku",
    stability: 0.8,
    similarity_boost: 0.6,
    style: 0.1,
  },
  qingqing: {
    voiceId: "cgSgspJ2msm6clMCkdW9",
    stability: 0.7,
    similarity_boost: 0.75,
    style: 0.4,
  },
  narrator: {
    voiceId: "JBFqnCBsd6RMkjVDRZzb",
    stability: 0.7,
    similarity_boost: 0.75,
    style: 0.3,
  },
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY not configured" },
      { status: 500 }
    );
  }

  const { text, charKey } = await req.json();
  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const config = VOICE_CONFIG[charKey ?? "narrator"] ?? VOICE_CONFIG.narrator;

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: config.stability,
          similarity_boost: config.similarity_boost,
          style: config.style,
        },
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    return NextResponse.json(
      { error: "ElevenLabs API error", detail: body },
      { status: res.status }
    );
  }

  const audioBuffer = await res.arrayBuffer();
  return new NextResponse(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
