require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing categories
  await prisma.category.deleteMany();

  // ── Parent categories ──
  const fashion = await prisma.category.create({
    data: {
      name: "Fashion",
      namebn: "ফ্যাশন",
      slug: "fashion",
      description: "Clothing and apparel for everyone",
      icon: "👗",
    },
  });

  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      namebn: "ইলেকট্রনিক্স",
      slug: "electronics",
      description: "Gadgets, phones and tech accessories",
      icon: "📱",
    },
  });

  const home = await prisma.category.create({
    data: {
      name: "Home & Living",
      namebn: "হোম ও লিভিং",
      slug: "home-living",
      description: "Furniture, kitchen and home decor",
      icon: "🏠",
    },
  });

  const sports = await prisma.category.create({
    data: {
      name: "Sports",
      namebn: "স্পোর্টস",
      slug: "sports",
      description: "Sportswear and equipment",
      icon: "⚽",
    },
  });

  const accessories = await prisma.category.create({
    data: {
      name: "Accessories",
      namebn: "আনুষাঙ্গিক",
      slug: "accessories",
      description: "Bags, jewellery and watches",
      icon: "👜",
    },
  });

  // ── Fashion subcategories ──
  await prisma.category.createMany({
    data: [
      {
        name: "Men's Clothing",
        namebn: "পুরুষের পোশাক",
        slug: "mens-clothing",
        parentId: fashion.id,
        icon: "👔",
      },
      {
        name: "Women's Clothing",
        namebn: "মহিলাদের পোশাক",
        slug: "womens-clothing",
        parentId: fashion.id,
        icon: "👘",
      },
      {
        name: "Kids' Clothing",
        namebn: "শিশুদের পোশাক",
        slug: "kids-clothing",
        parentId: fashion.id,
        icon: "🧒",
      },
      {
        name: "Traditional Wear",
        namebn: "ঐতিহ্যবাহী পোশাক",
        slug: "traditional-wear",
        parentId: fashion.id,
        icon: "🥻",
      },
    ],
  });

  // ── Electronics subcategories ──
  await prisma.category.createMany({
    data: [
      {
        name: "Phones",
        namebn: "ফোন",
        slug: "phones",
        parentId: electronics.id,
        icon: "📱",
      },
      {
        name: "Laptops",
        namebn: "ল্যাপটপ",
        slug: "laptops",
        parentId: electronics.id,
        icon: "💻",
      },
      {
        name: "Headphones",
        namebn: "হেডফোন",
        slug: "headphones",
        parentId: electronics.id,
        icon: "🎧",
      },
      {
        name: "Cameras",
        namebn: "ক্যামেরা",
        slug: "cameras",
        parentId: electronics.id,
        icon: "📷",
      },
    ],
  });

  // ── Home subcategories ──
  await prisma.category.createMany({
    data: [
      {
        name: "Furniture",
        namebn: "আসবাবপত্র",
        slug: "furniture",
        parentId: home.id,
        icon: "🛋️",
      },
      {
        name: "Kitchen",
        namebn: "রান্নাঘর",
        slug: "kitchen",
        parentId: home.id,
        icon: "🍳",
      },
      {
        name: "Decor",
        namebn: "সাজসজ্জা",
        slug: "decor",
        parentId: home.id,
        icon: "🪴",
      },
    ],
  });

  // ── Sports subcategories ──
  await prisma.category.createMany({
    data: [
      {
        name: "Sportswear",
        namebn: "স্পোর্টসওয়্যার",
        slug: "sportswear",
        parentId: sports.id,
        icon: "🏃",
      },
      {
        name: "Equipment",
        namebn: "সরঞ্জাম",
        slug: "equipment",
        parentId: sports.id,
        icon: "🏋️",
      },
      {
        name: "Footwear",
        namebn: "জুতা",
        slug: "footwear",
        parentId: sports.id,
        icon: "👟",
      },
    ],
  });

  // ── Accessories subcategories ──
  await prisma.category.createMany({
    data: [
      {
        name: "Bags",
        namebn: "ব্যাগ",
        slug: "bags",
        parentId: accessories.id,
        icon: "👜",
      },
      {
        name: "Jewellery",
        namebn: "গহনা",
        slug: "jewellery",
        parentId: accessories.id,
        icon: "💍",
      },
      {
        name: "Watches",
        namebn: "ঘড়ি",
        slug: "watches",
        parentId: accessories.id,
        icon: "⌚",
      },
      {
        name: "Sunglasses",
        namebn: "সানগ্লাস",
        slug: "sunglasses",
        parentId: accessories.id,
        icon: "🕶️",
      },
    ],
  });

  console.log("✅ Categories seeded successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
