const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding clean initial accounts (0 dummy data)...");

  // Clear all dummy records
  await prisma.release.deleteMany({});
  await prisma.withdrawal.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.catalog.deleteMany({});

  // Clean Admin User
  await prisma.user.upsert({
    where: { email: "avelinfx@gmail.com" },
    update: {
      password: "1234",
      role: "ADMIN",
      name: "Avelin FX",
      totalStreams: 0,
      royaltyBalance: 0,
      royaltyPending: 0,
      totalWithdrawn: 0,
      pendingWithdraw: 0,
    },
    create: {
      email: "avelinfx@gmail.com",
      name: "Avelin FX",
      password: "1234",
      role: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      totalStreams: 0,
      royaltyBalance: 0,
      royaltyPending: 0,
      totalWithdrawn: 0,
      pendingWithdraw: 0,
    },
  });

  // Clean Artist User (Abdul)
  await prisma.user.upsert({
    where: { email: "abdul@hermes.music" },
    update: {
      password: "1234",
      role: "USER",
      name: "Abdul",
      totalStreams: 0,
      royaltyBalance: 0,
      royaltyPending: 0,
      totalWithdrawn: 0,
      pendingWithdraw: 0,
    },
    create: {
      email: "abdul@hermes.music",
      name: "Abdul",
      password: "1234",
      role: "USER",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      totalStreams: 0,
      royaltyBalance: 0,
      royaltyPending: 0,
      totalWithdrawn: 0,
      pendingWithdraw: 0,
    },
  });

  console.log("Database initialized with 0 dummy records. Ready for real user submissions and admin inputs!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
