import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Admin@123', 10);

  await prisma.admin.upsert({
    where: {
      email: 'admin@portfolio.com',
    },
    update: {},
    create: {
      email: 'admin@portfolio.com',
      password,
    },
  });

  console.log('✅ Admin created successfully');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });