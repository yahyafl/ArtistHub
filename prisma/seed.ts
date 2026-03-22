import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "artist@artisthub.com" },
    update: {},
    create: {
      name: "ArtistHub Team",
      email: "artist@artisthub.com",
      password: "hashed-password",
      role: "ADMIN",
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
    await prisma.project.create({ data: project });
  }

  console.log("✅ Seed data created!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());