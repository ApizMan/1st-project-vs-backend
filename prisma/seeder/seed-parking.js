import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  // Fetch all users
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  // Fetch all PBTs
  const pbts = await prisma.pbt.findMany({
    select: { id: true, name: true }, // Fetching both id and name for the PBT
  });

  // Create wallets only if they don't already exist
  const walletIds = [];
  for (const user of users) {
    const existingWallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    });

    if (!existingWallet) {
      const wallet = await prisma.wallet.create({
        data: {
          id: uuidv4(), // Unique wallet ID
          amount: 100.0, // Initial amount or set as needed
          userId: user.id, // Assuming each user has one wallet
        },
      });
      walletIds.push(wallet.id);
    } else {
      walletIds.push(existingWallet.id); // Use existing wallet ID
    }
  }

  // Create 1000 Wallet Transactions
  for (let i = 0; i < 1000; i++) {
    await prisma.walletTransaction.create({
      data: {
        id: uuidv4(), // Unique wallet transaction ID
        walletId: walletIds[Math.floor(Math.random() * walletIds.length)], // Randomly select a wallet ID
        type: Math.random() > 0.5 ? "credit" : "debit", // Randomly select type
        amount: Math.floor(Math.random() * 1000) + 1, // Random amount between 1 and 1000
        status: "completed", // Assuming all transactions are completed
      },
    });
  }

  // Fetch all wallet transaction IDs
  const walletTransactions = await prisma.walletTransaction.findMany({
    select: { id: true },
  });

  // Create 1000 Parkings using the wallet transaction IDs and PBT names as locations
  for (let i = 0; i < 1000; i++) {
    const randomWalletTransaction =
      walletTransactions[Math.floor(Math.random() * walletTransactions.length)];

    // Select a random user ID
    const randomUser = users[Math.floor(Math.random() * users.length)];

    // Select a random PBT
    const randomPbt = pbts[Math.floor(Math.random() * pbts.length)];

    await prisma.parking.create({
      data: {
        id: uuidv4(), // Add the unique ID here
        userId: randomUser.id, // Use a valid user ID
        walletTransactionId: randomWalletTransaction.id, // Randomly assign a wallet transaction
        plateNumber: `PLT${Math.floor(Math.random() * 10000)}`, // Random plate number
        pbt: randomPbt.id, // Use a random PBT ID
        location: randomPbt.name, // Use the name of the PBT as the location
      },
    });
  }

  console.log("Seed data has been inserted!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
