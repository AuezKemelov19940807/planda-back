import { Injectable } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';
import { GraphQLError } from 'graphql';
@Injectable()
export class CategoryService {
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
      throw new GraphQLError('Finance space not found', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    return prisma.category.findMany({
      where: {
        financeSpaceId: financeSpace.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async create() {}

  async update() {}

  async remove() {}
}
