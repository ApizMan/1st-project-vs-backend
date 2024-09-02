import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

async function main() {
  await prisma.pbt.create({
    data: {
      id: uuidv4(),
      name: "Majlis Bandaraya Kuala Terengganu",
      description: "Majlis Bandaraya Kuala Terengganu",
    },
  });

  await prisma.pbt.create({
    data: {
      id: uuidv4(),
      name: "Majlis Bandaraya Kuantan",
      description: "Majlis Bandaraya Kuantan",
    },
  });

  await prisma.pbt.create({
    data: {
      id: uuidv4(),
      name: "Majlis Daerah Machang",
      description: "Majlis Daerah Machang",
    },
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
