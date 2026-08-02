export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fermermarket.az";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/dashboard/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
