import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const permissions = [
    { name: "projects:read", label: "View Projects", section: "projects" },
    { name: "projects:create", label: "Create Projects", section: "projects" },
    { name: "projects:edit", label: "Edit Projects", section: "projects" },
    { name: "projects:delete", label: "Delete Projects", section: "projects" },
    { name: "blog:read", label: "View Blog Posts", section: "blog" },
    { name: "blog:create", label: "Create Blog Posts", section: "blog" },
    { name: "blog:edit", label: "Edit Blog Posts", section: "blog" },
    { name: "blog:delete", label: "Delete Blog Posts", section: "blog" },
    { name: "news:read", label: "View News", section: "news" },
    { name: "news:create", label: "Create News", section: "news" },
    { name: "news:edit", label: "Edit News", section: "news" },
    { name: "news:delete", label: "Delete News", section: "news" },
    { name: "submissions:read", label: "View Submissions", section: "submissions" },
    { name: "contacts:read", label: "View Contact Messages", section: "contacts" },
    { name: "content:edit", label: "Edit Site Content", section: "content" },
    { name: "users:manage", label: "Manage Users and Roles", section: "users" },
  ];

  const permissionRecords = await Promise.all(
    permissions.map((permission) =>
      prisma.permission.upsert({
        where: { name: permission.name },
        update: { label: permission.label, section: permission.section },
        create: permission,
      })
    )
  );

  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: { description: "Full access to the dashboard" },
    create: { name: "Admin", description: "Full access to the dashboard" },
  });

  const artistRole = await prisma.role.upsert({
    where: { name: "Junior Artist" },
    update: { description: "Create and manage own projects" },
    create: { name: "Junior Artist", description: "Create and manage own projects" },
  });

  await prisma.rolePermission.deleteMany({ where: { roleId: adminRole.id } });
  await prisma.rolePermission.createMany({
    data: permissionRecords.map((permission) => ({
      roleId: adminRole.id,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });

  const artistPermissionNames = [
    "projects:read",
    "projects:create",
    "projects:edit",
    "projects:delete",
    "blog:read",
    "news:read",
    "submissions:read",
  ];
  const artistPermissions = permissionRecords.filter((permission) =>
    artistPermissionNames.includes(permission.name)
  );

  await prisma.rolePermission.deleteMany({ where: { roleId: artistRole.id } });
  await prisma.rolePermission.createMany({
    data: artistPermissions.map((permission) => ({
      roleId: artistRole.id,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });

  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin123!";
  const adminHashed = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "artist@artisthub.com" },
    update: {
      name: "ArtistHub Team",
      password: adminHashed,
      status: "ACTIVE",
      roleId: adminRole.id,
    },
    create: {
      name: "ArtistHub Team",
      email: "artist@artisthub.com",
      password: adminHashed,
      status: "ACTIVE",
      roleId: adminRole.id,
    },
  });

  const projects = [
    {
      title: "Midnight in Beirut",
      description: "A soulful journey through the streets of Beirut at night. Blends traditional Arabic instruments with modern production techniques.",
      genre: "Arabic",
      mood: "Nostalgic",
      trackUrl: "https://soundcloud.com/discover",
      authorId: user.id,
    },
    {
      title: "Desert Wind",
      description: "An instrumental piece inspired by the vast Arabian desert. Features oud, qanun, and ambient electronic elements.",
      genre: "World",
      mood: "Peaceful",
      trackUrl: "https://soundcloud.com/discover",
      authorId: user.id,
    },
    {
      title: "City Lights",
      description: "An indie pop track about finding beauty in urban chaos. Upbeat guitar riffs with introspective lyrics.",
      genre: "Indie",
      mood: "Happy",
      trackUrl: "https://soundcloud.com/discover",
      authorId: user.id,
    },
    {
      title: "Rainy Season",
      description: "A melancholic jazz composition for rainy days. Piano-led with soft brushed drums.",
      genre: "Jazz",
      mood: "Melancholic",
      trackUrl: "https://soundcloud.com/discover",
      authorId: user.id,
    },
    {
      title: "Rise Up",
      description: "A powerful hip-hop anthem about perseverance and chasing dreams against all odds.",
      genre: "Hip-Hop",
      mood: "Energetic",
      trackUrl: "https://soundcloud.com/discover",
      authorId: user.id,
    },
    {
      title: "Ocean Drive",
      description: "A breezy electronic track with smooth synths. Perfect for late night drives.",
      genre: "Electronic",
      mood: "Chill",
      trackUrl: "https://soundcloud.com/discover",
      authorId: user.id,
    },
  ];

  for (const project of projects) {
    const existing = await prisma.project.findFirst({
      where: { title: project.title, authorId: adminUser.id },
    });
    if (!existing) {
      await prisma.project.create({ data: project });
    }
  }

  const blogs = [
    {
      title: "The Art of Building a Music Brand as an Independent Artist",
      content:
        "Your music is only half the story. Build your identity across visuals, community, and live moments.",
      imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    },
    {
      title: "Why Mood Matters More Than Genre in Modern Music Discovery",
      content:
        "Listeners explore by mood, not just genre. Lean into emotions and create playlists accordingly.",
      imageUrl: "https://images.unsplash.com/photo-1485579149621-3123dd979885",
    },
  ];

  for (const blog of blogs) {
    const existing = await prisma.blog.findFirst({ where: { title: blog.title } });
    if (!existing) {
      await prisma.blog.create({ data: blog });
    }
  }

  const newsItems = [
    {
      title: "ArtistHub launches new playlist tool",
      content: "Try the AI playlist generator to discover tracks that match your mood.",
      imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    },
    {
      title: "Community spotlight: Beirut Sessions",
      content: "Highlighting independent talent from across the region.",
      imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
    },
  ];

  for (const item of newsItems) {
    const existing = await prisma.news.findFirst({ where: { title: item.title } });
    if (!existing) {
      await prisma.news.create({ data: item });
    }
  }

  await prisma.siteContent.upsert({
    where: { page: "home" },
    update: {
      content: {
        heroTitle: "Where Artists Tell Their Story",
        heroSubtitle: "Discover independent music and the people behind it.",
      },
    },
    create: {
      page: "home",
      content: {
        heroTitle: "Where Artists Tell Their Story",
        heroSubtitle: "Discover independent music and the people behind it.",
      },
    },
  });

  await prisma.siteContent.upsert({
    where: { page: "about" },
    update: {
      content: {
        headline: "We Believe Every Artist Deserves a Stage",
        story: "ArtistHub is a home for independent creators who want to share their sound.",
        mission: "Empower artists with tools, visibility, and community.",
      },
    },
    create: {
      page: "about",
      content: {
        headline: "We Believe Every Artist Deserves a Stage",
        story: "ArtistHub is a home for independent creators who want to share their sound.",
        mission: "Empower artists with tools, visibility, and community.",
      },
    },
  });

  await prisma.siteContent.upsert({
    where: { page: "services" },
    update: {
      content: {
        headline: "Everything an Independent Artist Needs",
        subheadline: "From promotion to discovery, we help you build momentum.",
      },
    },
    create: {
      page: "services",
      content: {
        headline: "Everything an Independent Artist Needs",
        subheadline: "From promotion to discovery, we help you build momentum.",
      },
    },
  });

  console.log("Seed complete. Admin: artist@artisthub.com / " + adminPassword);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());