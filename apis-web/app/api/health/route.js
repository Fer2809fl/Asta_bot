import { NextResponse } from "next/server";
import { storageMode } from "../../../lib/store";

export async function GET() {
  return NextResponse.json({ ok: true, storage: storageMode() });
}
