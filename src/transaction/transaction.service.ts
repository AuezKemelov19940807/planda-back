import { Injectable } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';
import { GraphQLError } from 'graphql';
import { CreateTransactionDto } from './dto/create.transaction.dto.js';
import { UpdateTransactionDto } from './dto/update.transaction.dto.js';
import { TransactionType } from '../generated/prisma/enums.js';

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

  private async findOwnCategory(
    userId: string,
    financeSpaceId: string,
    categoryId: string,
    type: TransactionType,
  ) {
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        financeSpaceId,
        type,
        financeSpace: {
          finance: {
            userId,
          },
        },
      },
    });

    if (!category) {
      throw new GraphQLError(
        'Category not found or does not match transaction type',
        {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        },
      );
    }

    return category;
  }

  private validateTransaction(amout: number) {
    if (!Number.isFinite(amout) || amout <= 0) {
      throw new GraphQLError('Amount must be greter than zero', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }
  }

  private normalizeUpdateInput(input: UpdateTransactionDto) {
    return {
      ...input,
      ...(input.comment !== undefined && {
        comment: input.comment?.trim() || null,
      }),
    };
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
    const { financeSpaceId, type, amount, categoryId, comment, date } = input;

    await this.findOwnSpace(userId, financeSpaceId);

    await this.findOwnCategory(userId, financeSpaceId, categoryId, type);

    this.validateTransaction(amount);

    const commentTrim = comment?.trim() || null;

    return prisma.transaction.create({
      data: {
        financeSpaceId,
        type,
        amount,
        categoryId,
        comment: commentTrim,
        ...(date && { date }),
      },
    });
  }

  async update(userId: string, id: string, input: UpdateTransactionDto) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        financeSpace: {
          finance: {
            userId,
          },
        },
      },
    });

    if (!transaction) {
      throw new GraphQLError('Transaction Not Found', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    const nextType = input.type ?? transaction.type;

    const nextCategoryId = input.categoryId ?? transaction.categoryId;

    if (input.amount !== undefined) {
      this.validateTransaction(input.amount);
    }

    if (input.categoryId !== undefined || input.type !== undefined) {
      await this.findOwnCategory(
        userId,
        transaction.financeSpaceId,
        nextCategoryId,
        nextType,
      );
    }

    return prisma.transaction.update({
      where: {
        id,
      },
      data: this.normalizeUpdateInput(input),
    });
  }

  async delete(userId: string, id: string) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        financeSpace: {
          finance: {
            userId,
          },
        },
      },
    });

    if (!transaction) {
      throw new GraphQLError('Transaction Not Found', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    await prisma.transaction.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
