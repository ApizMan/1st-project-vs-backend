import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

// Function to generate a random Malaysian-style plate number, e.g., "WVL 1234"
function generateRandomPlateNumber() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters = Array.from(
    { length: 3 },
    () => letters[Math.floor(Math.random() * letters.length)],
  ).join("");
  const randomNumbers = Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
  return `${randomLetters} ${randomNumbers}`;
}

// Monthly Pass packages with amounts and durations
const monthlyPassPackages = [
  { duration: "1 Month", amount: 79.5 },
  { duration: "3 Months", amount: 207.0 },
  { duration: "12 Months", amount: 667.8 },
];

async function main() {
  // Fetch all existing users to associate with the monthly passes
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log(
      "No users found. Please run the user-seeder.js first to create some users.",
    );
    return;
  }

  // Fetch all PBTS for assigning pbt and location fields
  const pbts = await prisma.pbt.findMany();
  if (pbts.length === 0) {
    console.log("No PBTs found. Please seed the PBT model first.");
    return;
  }

  // Create 100 monthly passes
  const monthlyPassesData = Array.from({ length: 100 }, (_, index) => {
    const user = users[index % users.length]; // Reuse users cyclically
    const pbt = pbts[index % pbts.length]; // Reuse PBTs cyclically
    const packageDetails =
      monthlyPassPackages[index % monthlyPassPackages.length]; // Cycle through monthly pass packages

    return {
      id: uuidv4(),
      userId: user.id,
      plateNumber: generateRandomPlateNumber(),
      pbt: pbt.name, // Use PBT name as `pbt`
      location: pbt.description, // Use PBT description as `location`
      amount: packageDetails.amount, // Use amount from package details
      duration: packageDetails.duration, // Use duration from package details
    };
  });

  // Use createMany to insert all 100 monthly passes at once
  const monthlyPasses = await prisma.monthlyPass.createMany({
    data: monthlyPassesData,
  });

  console.log("100 Monthly passes created successfully:", monthlyPasses);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
