import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Define the hashPassword function
async function hashPassword(password) {
  const saltRounds = 10; // Number of salt rounds for bcrypt
  return await bcrypt.hash(password, saltRounds);
}

async function main() {
  // Hash the password before storing it
  const hashedPassword = await hashPassword("password");

  // Create a new user
  const user = await prisma.user.create({
    data: {
      id: uuidv4(),
      firstName: "test",
      secondName: "admin",
      idNumber: "1234567890",
      phoneNumber: "555-555-5555",
      email: "testadmin@example.com",
      password: hashedPassword, // Use the hashed password here
      address1: "123 Main St",
      address2: "Apt 4B",
      address3: null,
      postcode: 12345,
      city: "Cityville",
      state: "Stateland",
      wallet: {
        create: {
          id: uuidv4(),
          amount: 100.0,
        },
      },
      plateNumbers: {
        create: [
          {
            id: uuidv4(),
            plateNumber: "ABC123",
            isMain: true,
          },
          {
            id: uuidv4(),
            plateNumber: "XYZ789",
            isMain: false,
          },
        ],
      },
    },
    include: {
      wallet: true,
      plateNumbers: true,
    },
  });

  console.log("User created:", user);

  // Optionally, create more users, wallets, or plate numbers here
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
