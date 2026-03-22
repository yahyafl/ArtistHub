import prisma from "@/lib/prisma";
import NewsManager from "@/components/dashboard/NewsManager";

export default async function DashboardNewsPage() {
  const news = await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <span className="section-label">Content</span>
        <h1 style={{ fontSize: "32px" }}>News</h1>
      </div>
      <NewsManager news={news} />
    </div>
  );
}