import { Injectable } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';
import { GraphQLError } from 'graphql';
import { CategoryCreateDto } from './dto/create.category.dto.js';
import { Prisma } from '../generated/prisma/client.js';
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

  async create(
    userId: string,
    financeSpaceId: string,
    input: CategoryCreateDto,
  ) {
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

    try {
      return await prisma.category.create({
        data: {
          name: input.name.trim(),
          type: input.type,
          financeSpace: {
            connect: {
              id: financeSpace.id,
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new GraphQLError('Category already exists', {
          extensions: {
            code: 'CONFLICT',
          },
        });
      }

      throw error;
    }
  }

  async update() {}

  async remove() {}
}
