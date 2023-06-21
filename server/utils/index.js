import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const generateUsername = (name) => {
  // Convert name to lowercase and remove spaces
  const lowercaseName = name.toLowerCase();
  const username = lowercaseName.replace(/\s/g, "");

  return generateUniqueUsername(username);
};

async function generateUniqueUsername(username) {
  let uniqueUsername = username;
  let counter = 1;

  while (true) {
    const existingUser = await prisma.user.findUnique({
      where: { handle: uniqueUsername },
    });

    if (!existingUser) {
      break;
    }

    // Append a counter to the username if it already exists
    uniqueUsername = `${username}${counter}`;
    counter++;
  }

  return uniqueUsername;
}
