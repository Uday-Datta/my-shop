const badges = [
  {
    icon: "🚚",
    title: "Free Delivery",
    titlebn: "বিনামূল্যে ডেলিভারি",
    subtitle: "On orders over ৳999",
    subtitlebn: "৳৯৯৯ এর উপরে অর্ডারে",
  },
  {
    icon: "🔄",
    title: "Easy Returns",
    titlebn: "সহজ রিটার্ন",
    subtitle: "7 day return policy",
    subtitlebn: "৭ দিনের রিটার্ন পলিসি",
  },
  {
    icon: "🔒",
    title: "Secure Payment",
    titlebn: "নিরাপদ পেমেন্ট",
    subtitle: "bKash & Cash on Delivery",
    subtitlebn: "বিকাশ ও ক্যাশ অন ডেলিভারি",
  },
  {
    icon: "💬",
    title: "24/7 Support",
    titlebn: "২৪/৭ সাপোর্ট",
    subtitle: "Always here to help",
    subtitlebn: "সবসময় সাহায্যের জন্য আছি",
  },
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.title}
          className="card p-4 md:p-5 flex flex-col items-center text-center gap-2"
        >
          <span className="text-3xl">{badge.icon}</span>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {badge.title}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {badge.titlebn}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {badge.subtitle}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {badge.subtitlebn}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
