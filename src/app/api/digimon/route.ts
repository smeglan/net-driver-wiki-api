import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/shared/lib/database";
import Digimon, { IDigimon } from "@/domains/digimon/models/digimon.model";
import { isAuthorized } from "@/shared/services/auth-middleware";
import { revalidateTag } from "next/cache";

export async function GET() {
  try {
    await connectDB();
    const digimons = await Digimon.find();
    return NextResponse.json(digimons, { status: 200 });
  } catch (error) {
    console.log("Error to get Digimons", error);
    return NextResponse.json(
      { error: "Error to get Digimon" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body: IDigimon = await request.json();
    const newDigimon = new Digimon(body);
    await newDigimon.save();
    revalidateTag("digimons");
    return NextResponse.json(newDigimon, { status: 201 });
  } catch (error) {
    console.log("Error to save Digimon", error);
    return NextResponse.json(
      { error: "Error to save Digimon" },
      { status: 500 }
    );
  }
}
