import { getCars } from "@/lib/data"
import { NextResponse } from "next/server"

export async function GET() {
  const cars = await getCars()
  return NextResponse.json(cars)
}
