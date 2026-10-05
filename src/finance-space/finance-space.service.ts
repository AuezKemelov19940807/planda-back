import { Injectable } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';
import { GraphQLError } from 'graphql';

@Injectable()
export class FinanceSpaceService {
  async getSpaces(userId: string) {
    const finance = await prisma.finance.findUnique({
      where: {
        userId,
      },
    });

    if (!finance) {
      throw new GraphQLError('Finance not found', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    return prisma.financeSpace.findMany({
      where: {
        financeId: finance.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async createSpace(userId: string, name: string) {
    const finance = await prisma.finance.findUnique({
      where: {
        userId,
      },
    });

    if (!finance) {
      throw new GraphQLError('Finance not found', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    try {
      return await prisma.financeSpace.create({
        data: {
          financeId: finance.id,
          name: name.trim(),
          isDefault: false,
        },
      });
    } catch (error) {
      throw new GraphQLError('Finance space already exists', {
        extensions: {
          code: 'CONFLICT',
        },
      });
    }
  }
}
