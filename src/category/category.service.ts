import { Injectable } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';
import { GraphQLError } from 'graphql';
import { CategoryCreateDto } from './dto/create.category.dto.js';
import { Prisma } from '../generated/prisma/client.js';
import { CategoryUpdateDto } from './dto/update.category.dto.js';
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

  async update(
    userId: string,
    financeSpaceId: string,
    categoryId: string,
    input: CategoryUpdateDto,
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
      return await prisma.category.update({
        where: {
          id: categoryId,
          financeSpaceId: financeSpace.id,
        },
        data: {
          name: input.name.trim(),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new GraphQLError('Category not found', {
            extensions: {
              code: 'NOT_FOUND',
            },
          });
        }

        if (error.code === 'P2002') {
          throw new GraphQLError('Category already exists', {
            extensions: {
              code: 'CONFLICT',
            },
          });
        }
      }

      throw error;
    }
  }

  async remove(userId: string, financeSpaceId: string, categoryId: string) {
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
      await prisma.category.delete({
        where: {
          id: categoryId,
          financeSpaceId: financeSpace.id,
        },
      });

      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new GraphQLError('Category not found', {
            extensions: {
              code: 'NOT_FOUND',
            },
          });
        }

        if (error.code === 'P2003') {
          throw new GraphQLError(
            'Cannot delete category because it is used by transactions',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
              },
            },
          );
        }
      }
    }
  }
}
