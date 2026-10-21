import { Injectable } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';
import { GraphQLError } from 'graphql';
import { CreateTransactionDto } from './dto/create.transaction.dto.js';

@Injectable()
export class TransactionService {
  private async findOwnSpace(userId: string, financeSpaceId: string) {
    const financeSpace = await prisma.financeSpace.findFirst({
      where: {
        id: financeSpaceId,
        finance: {
          userId,
        },
      },
    });

    if (!financeSpace) {
      throw new GraphQLError('Finance Space Not Found', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    return financeSpace;
  }

  private validateTransaction(amout: number, category: string) {
    if (!Number.isFinite(amout) || amout <= 0) {
      throw new GraphQLError('Amount must be greter than zero', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }
  }

  async get(userId: string, financeSpaceId: string) {
    const financeSpace = await prisma.financeSpace.findFirst({
      where: {
        id: financeSpaceId,
        finance: {
          userId,
        },
      },
    });

    if (!financeSpace) {
      throw new GraphQLError('Finance Space Not Found', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    return prisma.transaction.findMany({
      where: {
        financeSpaceId,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async create(userId: string, input: CreateTransactionDto) {
    const { financeSpaceId, type, amount, category, comment, date } = input;

    await this.findOwnSpace(userId, financeSpaceId);

    this.validateTransaction(amount, category);

    const commentTrim = comment?.trim() || null;

    return prisma.transaction.create({
      data: {
        financeSpaceId,
        type,
        amount,
        category,
        comment: commentTrim,
        ...(date && { date }),
      },
    });
  }

  async update() {}

  async delete() {}
}
