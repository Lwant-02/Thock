import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv();

export async function GET() {
  const count = (await redis.get<number>("global_thocks")) || 0;
  return NextResponse.json({ count });
}

export async function POST(req: Request) {
  const { amount } = await req.json();
  const newCount = await redis.incrby("global_thocks", amount || 1);
  return NextResponse.json({ count: newCount });
}
