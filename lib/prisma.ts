import { PrismaClient } from "@prisma/client";

// This tells TypeScript that 'prisma' might exist on the global object
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Use the existing global instance if it exists, otherwise create a new one
const db = globalThis.prisma ?? prismaClientSingleton();

export default db;

// In development, save the instance to the global object so it survives Hot Module Reloads
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;