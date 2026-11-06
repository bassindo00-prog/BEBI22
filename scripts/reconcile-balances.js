const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function reconcile() {
  console.log("Starting reconciliation of royalty balances...");
  const users = await prisma.user.findMany({
    include: { withdrawals: true }
  });

  let oldTotalRoyalty = 0;
  let newTotalRoyalty = 0;
  let totalApproved = 0;
  let updatedUsers = 0;

  for (const u of users) {
    const originalBal = Number(u.royaltyBalance) || 0;
    oldTotalRoyalty += originalBal;

    const approvedSum = u.withdrawals
      .filter((w) => w.status === "Approved")
      .reduce((sum, w) => sum + (Number(w.amount) || 0), 0);

    const pendingSum = u.withdrawals
      .filter((w) => w.status === "Pending")
      .reduce((sum, w) => sum + (Number(w.amount) || 0), 0);

    totalApproved += approvedSum;

    if (approvedSum > 0 || (u.pendingWithdraw || 0) !== pendingSum) {
      const netRoyalty = Math.max(0, originalBal - approvedSum);
      newTotalRoyalty += netRoyalty;

      await prisma.user.update({
        where: { id: u.id },
        data: {
          royaltyBalance: netRoyalty,
          pendingWithdraw: pendingSum,
          totalWithdrawn: approvedSum,
        },
      });

      console.log(`Updated user ${u.name} (${u.email}): Balance ${originalBal} -> ${netRoyalty}, Withdrawn -> ${approvedSum}, Pending -> ${pendingSum}`);
      updatedUsers++;
    } else {
      newTotalRoyalty += originalBal;
    }
  }

  console.log("--- Reconciliation Complete ---");
  console.log(`Users updated: ${updatedUsers}`);
  console.log(`Old Global Royalty: Rp ${oldTotalRoyalty.toLocaleString("id-ID")}`);
  console.log(`Total Approved Payouts: Rp ${totalApproved.toLocaleString("id-ID")}`);
  console.log(`New Global Royalty (Saldo Endap Musisi): Rp ${newTotalRoyalty.toLocaleString("id-ID")}`);
}

reconcile()
  .catch((e) => {
    console.error("Reconciliation failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

