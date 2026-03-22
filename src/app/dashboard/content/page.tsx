import prisma from "@/lib/prisma";
import ContentEditor from "@/components/dashboard/ContentEditor";

export default async function ContentPage() {
  const [home, about, services] = await Promise.all([
    prisma.siteContent.findUnique({ where: { page: "home" } }),
    prisma.siteContent.findUnique({ where: { page: "about" } }),
    prisma.siteContent.findUnique({ where: { page: "services" } }),
  ]);

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <span className="section-label">CMS</span>
        <h1 style={{ fontSize: "32px" }}>Site Content</h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "8px" }}>
          Edit the content shown on Home, About, and Services pages.
        </p>
      </div>
      <ContentEditor
        homeContent={home?.content as any}
        aboutContent={about?.content as any}
        servicesContent={services?.content as any}
      />
    </div>
  );
}