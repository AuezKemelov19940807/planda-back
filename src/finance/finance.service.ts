import { Injectable } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';

@Injectable()
export class FinanceService {
  async getFinance(userId: string) {
    return prisma.finance.findUnique({
      where: {
        userId,
      },

      include: {
        spaces: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }
}
