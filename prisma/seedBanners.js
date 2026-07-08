require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.banner.deleteMany();

  // Hero banners
  await prisma.banner.createMany({
    data: [
      {
        title: "New Arrivals",
        titlebn: "নতুন কালেকশন",
        subtitle: "Discover the latest fashion trends",
        subtitlebn: "সর্বশেষ ফ্যাশন ট্রেন্ড আবিষ্কার করুন",
        cta: "Shop Now",
        ctabn: "এখনই কিনুন",
        href: "/category/fashion",
        gradient: "from-purple-600 to-indigo-700",
        emoji: "👗",
        badge: "New Season",
        badgebn: "নতুন সিজন",
        type: "HERO",
        active: true,
        order: 1,
      },
      {
        title: "Electronics Sale",
        titlebn: "ইলেকট্রনিক্স সেল",
        subtitle: "Up to 40% off on top gadgets",
        subtitlebn: "সেরা গ্যাজেটে ৪০% পর্যন্ত ছাড়",
        cta: "Explore Deals",
        ctabn: "অফার দেখুন",
        href: "/category/electronics",
        gradient: "from-blue-600 to-cyan-600",
        emoji: "📱",
        badge: "40% Off",
        badgebn: "৪০% ছাড়",
        type: "HERO",
        active: true,
        order: 2,
      },
      {
        title: "Traditional Wear",
        titlebn: "ঐতিহ্যবাহী পোশাক",
        subtitle: "Celebrate culture with style",
        subtitlebn: "ঐতিহ্যকে স্টাইলে উদযাপন করুন",
        cta: "View Collection",
        ctabn: "কালেকশন দেখুন",
        href: "/category/traditional-wear",
        gradient: "from-orange-500 to-rose-600",
        emoji: "🥻",
        badge: "Exclusive",
        badgebn: "এক্সক্লুসিভ",
        type: "HERO",
        active: true,
        order: 3,
      },
      {
        title: "Sports & Fitness",
        titlebn: "স্পোর্টস ও ফিটনেস",
        subtitle: "Gear up for your best performance",
        subtitlebn: "সেরা পারফরম্যান্সের জন্য প্রস্তুত হন",
        cta: "Shop Sports",
        ctabn: "স্পোর্টস দেখুন",
        href: "/category/sports",
        gradient: "from-green-500 to-emerald-600",
        emoji: "⚽",
        badge: "Best Sellers",
        badgebn: "বেস্ট সেলার",
        type: "HERO",
        active: true,
        order: 4,
      },
    ],
  });

  // Promo banners
  await prisma.banner.createMany({
    data: [
      {
        title: "Fashion Sale",
        titlebn: "ফ্যাশন সেল",
        subtitle: "Up to 50% Off",
        subtitlebn: "৫০% পর্যন্ত ছাড়",
        cta: "Limited Time · সীমিত সময়",
        href: "/category/fashion",
        gradient: "from-pink-500 to-rose-600",
        emoji: "👗",
        badge: "Up to 50% Off · ৫০% পর্যন্ত ছাড়",
        type: "PROMO",
        active: true,
        order: 1,
      },
      {
        title: "Accessories",
        titlebn: "আনুষাঙ্গিক পণ্য",
        subtitle: "Shop Now · এখনই কিনুন",
        subtitlebn: "নতুন কালেকশন",
        cta: "New Collection · নতুন কালেকশন",
        href: "/category/accessories",
        gradient: "from-amber-500 to-orange-600",
        emoji: "👜",
        badge: "Shop Now · এখনই কিনুন",
        type: "PROMO",
        active: true,
        order: 2,
      },
    ],
  });

  console.log("✅ Banners seeded successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
