import { getMetacriticData } from "@/lib/metacritic";
import { NextResponse } from "next/server";

const CACHE_SECONDS = 3600;

export const runtime = "nodejs";
export const revalidate = 3600;

function json(data, init = {}) {
  const response = NextResponse.json(data, init);

  response.headers.set("Cache-Control", `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS * 6}`);

  return response;
}

export async function GET() {
  try {
    const { items, dataset } = await getMetacriticData();
    const response = json(items);

    response.headers.set("X-Apify-Dataset-Id", dataset.id);
    response.headers.set("X-Apify-Data-Source", dataset.source);

    if (dataset.runId) {
      response.headers.set("X-Apify-Run-Id", dataset.runId);
    }

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load Metacritic data.";

    return NextResponse.json(
      { error: message },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
