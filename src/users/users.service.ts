import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { prisma } from '../lib/prisma.js';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update.user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { GraphQLError } from 'graphql';

@Injectable()
export class UsersService {
  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      return await prisma.user.create({
        data: {
          ...dto,
          password: hashedPassword,
          finance: {
            create: {
              spaces: {
                create: {
                  name: 'Personal',
                  isDefault: true,
                },
              },
            },
          },
        },
        include: {
          finance: {
            include: {
              spaces: true,
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new GraphQLError('Email already exists', {
          extensions: {
            code: 'CONFLICT',
          },
        });
      }
      throw error;
    }
  }

  async findOne(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(dto: UpdateUserDto) {
    const { id, ...data } = dto;

    try {
      return await prisma.user.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }

      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await prisma.user.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      throw error;
    }
  }

  async savePasswordResetCode(id: string, codeHash: string, expiresAt: Date) {
    return prisma.user.update({
      where: { id },
      data: {
        resetPasswordTokenHash: codeHash,
        resetPasswordExpiresAt: expiresAt,
      },
    });
  }

  async updatePassword(id: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        resetPasswordTokenHash: null,
        resetPasswordExpiresAt: null,
      },
    });
  }

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    // Google-пользователь может не иметь пароля
    if (!user.password) {
      throw new GraphQLError('Password is not set for this account', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new GraphQLError('Current password is incorrect', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async createGoogleUser(data: {
    email: string;
    name?: string | null;
    avatar?: string | null;
    googleId: string;
  }) {
    return prisma.user.create({
      data: {
        email: data.email,
        password: null,
        name: data.name,
        avatar: data.avatar,
        googleId: data.googleId,
        finance: {
          create: {
            spaces: {
              create: {
                name: 'Personal',
                isDefault: true,
              },
            },
          },
        },
      },

      include: {
        finance: {
          include: {
            spaces: true,
          },
        },
      },
    });
  }

  async connectGoogleAccount(
    id: string,
    googleId: string,
    name?: string | null,
    avatar?: string | null,
  ) {
    return prisma.user.update({
      where: { id },
      data: {
        googleId,
        name,
        avatar,
      },
    });
  }
}
