import prisma from "../lib/db.js";

async function main() {
  console.log("Seeding games...");

  await prisma.game.createMany({
    data: [
      {
        name: "CS2",
        imageUrl: "https://placehold.co/420x240?text=CS2"
      },
      {
        name: "Minecraft",
        imageUrl: "https://placehold.co/420x240?text=Minecraft"
      },
      {
        name: "Valorant",
        imageUrl: "https://placehold.co/420x240?text=Valorant"
      },
      {
        name: "League of Legends",
        imageUrl: "https://placehold.co/420x240?text=League+of+Legends"
      }
    ],
    skipDuplicates: true
  });

  console.log("Games added successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
