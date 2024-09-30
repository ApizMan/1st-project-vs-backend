import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

async function main() {
  await prisma.pbt.create({
    data: {
      id: uuidv4(),
      name: "PBT Kuala Terengganu",
      description: "Terengganu",
    },
  });

  await prisma.pbt.create({
    data: {
      id: uuidv4(),
      name: "PBT Kuantan",
      description: "Kuantan",
    },
  });

  await prisma.pbt.create({
    data: {
      id: uuidv4(),
      name: "PBT Machang",
      description: "Machang",
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
