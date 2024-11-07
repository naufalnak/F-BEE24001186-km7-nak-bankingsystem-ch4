const prisma = require("../config/prisma");

class Transaction {
  static async createTransaction(data) {
    const { source_account_id, destination_account_id, amount } = data;

    const sourceAccount = await prisma.bankAccount.findUnique({
      where: { account_id: source_account_id },
    });

    const destinationAccount = await prisma.bankAccount.findUnique({
      where: { account_id: destination_account_id },
    });

    if (!sourceAccount || !destinationAccount) {
      throw new Error("Source or Destination account not found");
    }

    if (sourceAccount.balance < amount) {
      throw new Error("Insufficient balance in source account");
    }

    const transaction = await prisma.transaction.create({
      data: {
        source_account_id,
        destination_account_id,
        amount,
      },
    });

    await prisma.bankAccount.update({
      where: { account_id: source_account_id },
      data: { balance: sourceAccount.balance - amount },
    });

    await prisma.bankAccount.update({
      where: { account_id: destination_account_id },
      data: { balance: destinationAccount.balance + amount },
    });

    return transaction;
  }

  static async getTransactions() {
    return await prisma.transaction.findMany({
      include: {
        sourceAccount: true,
        destinationAccount: true,
      },
    });
  }

  static async getTransactionById(transactionId) {
    const transaction = await prisma.transaction.findUnique({
      where: { transaction_id: Number(transactionId) },
      include: {
        sourceAccount: true,
        destinationAccount: true,
      },
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return transaction;
  }
}

module.exports = Transaction;
