import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get("image");

  if (!image || typeof image === "string") {
    return NextResponse.json({ message: "Image file is required" }, { status: 400 });
  }

  const buffer = Buffer.from(await image.arrayBuffer());
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
    method: "POST",
    body: new URLSearchParams({
      image: buffer.toString("base64"),
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.json({ url: data.data.url });
}
