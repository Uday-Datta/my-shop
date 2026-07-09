import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return false;
  return true;
}

export async function PUT(req, { params }) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const data = await req.json();
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      image: data.image || null,
      stock: data.stock,
      categoryId: data.categoryId || null,
    },
  });
  return NextResponse.json(product);
}

export async function DELETE(req, { params }) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);

    // Check for foreign key violation - works across Prisma error formats
    const errorString = JSON.stringify(error);
    const isForeignKeyError =
      error.code === "P2003" ||
      error?.cause?.code === "23001" ||
      error?.cause?.originalCode === "23001" ||
      errorString.includes("foreign key") ||
      errorString.includes("Foreign key") ||
      errorString.includes("23001");

    if (isForeignKeyError) {
      return NextResponse.json(
        {
          error:
            "This product cannot be deleted because it has existing orders. Set stock to 0 instead to hide it from customers.",
          code: "HAS_ORDERS",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
