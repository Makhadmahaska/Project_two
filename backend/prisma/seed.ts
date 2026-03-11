import prisma from "../lib/db.js";

async function main() {
  await prisma.game.createMany({
    data: [
      { name: "CS2" },
      { name: "Minecraft" },
      { name: "Valorant" },
      { name: "League of Legends" }
    ]
  });

  console.log("Games added successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });