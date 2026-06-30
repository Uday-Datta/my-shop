require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Wireless Headphones",
        description: "Premium sound quality with noise cancellation.",
        price: 99.99,
        category: "Electronics",
        stock: 20,
        image: "https://placehold.co/400x300?text=Headphones",
      },
      {
        name: "Running Shoes",
        description: "Lightweight and comfortable for everyday runs.",
        price: 59.99,
        category: "Sports",
        stock: 35,
        image: "https://placehold.co/400x300?text=Shoes",
      },
      {
        name: "Coffee Maker",
        description: "Brew the perfect cup every morning.",
        price: 45.0,
        category: "Home",
        stock: 15,
        image: "https://placehold.co/400x300?text=Coffee+Maker",
      },
      {
        name: "Leather Backpack",
        description: "Stylish and durable for work or travel.",
        price: 79.99,
        category: "Accessories",
        stock: 10,
        image: "https://placehold.co/400x300?text=Backpack",
      },
    ],
  });
  console.log("✅ Sample products created!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
