import { NextResponse } from "next/server";
import { getWordPressFrontendData } from "@/lib/wordpress";

export async function GET() {
  const data = await getWordPressFrontendData();

  return NextResponse.json(data);
}
