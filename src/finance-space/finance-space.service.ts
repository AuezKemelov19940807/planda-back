import { Injectable } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';
import { GraphQLError } from 'graphql';
import slugify from 'slugify';
import { Prisma } from '../generated/prisma/client.js';
@Injectable()
export class FinanceSpaceService {
  async get(userId: string) {
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

  async create(userId: string, name: string) {
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

    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new GraphQLError('Name is required', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const slug = slugify(trimmedName, {
      lower: true,
      strict: true,
      locale: 'ru',
    });

    if (!slug) {
      throw new GraphQLError('Invalid finance space name', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }

    try {
      return await prisma.financeSpace.create({
        data: {
          financeId: finance.id,
          name: name.trim(),
          slug,
          isDefault: false,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new GraphQLError('Finance space already exists', {
          extensions: { code: 'CONFLICT' },
        });
      }

      throw error;
    }
  }

  async update(userId: string, id: string, name: string) {
    const financeSpace = await prisma.financeSpace.findUnique({
      where: {
        id,
        finance: {
          userId,
        },
      },
    });

    if (!financeSpace) {
      throw new GraphQLError('Finance not found', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    if (financeSpace.isDefault) {
      throw new GraphQLError('Cannot rename default finance space', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new GraphQLError('Name is required', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }

    if (trimmedName.length > 50) {
      throw new GraphQLError('Name must not exceed 50 characters', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    try {
      return await prisma.financeSpace.update({
        where: {
          id: financeSpace.id,
        },

        data: {
          name: trimmedName,
        },
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2002') {
        throw new GraphQLError('Finance space already exists', {
          extensions: {
            code: 'CONFLICT',
          },
        });
      }
      throw error;
    }
  }

  async delete(userId: string, id: string) {
    const financeSpace = await prisma.financeSpace.findUnique({
      where: {
        id,
        finance: {
          userId,
        },
      },
    });

    if (!financeSpace) {
      throw new GraphQLError('Finance not found', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    if (financeSpace.isDefault) {
      throw new GraphQLError('Cannot delete default finance space', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }

    const transactionCount = await prisma.transaction.count({
      where: {
        financeSpaceId: financeSpace.id,
      },
    });

    if (transactionCount > 0) {
      throw new GraphQLError('Cannot delete finance space with transactions', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }

    await prisma.financeSpace.delete({
      where: {
        id: financeSpace.id,
      },
    });
    return true;
  }
}
