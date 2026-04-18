import { PrismaClient } from '@bharatlens/db';

const prismaClientSingleton = (): PrismaClient => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | PrismaClient;
}

const prisma: PrismaClient = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
