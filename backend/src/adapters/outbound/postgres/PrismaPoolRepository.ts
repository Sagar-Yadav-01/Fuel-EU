import { IPoolRepository } from '@/core/ports/IPoolRepository';
import { Pool, PoolMember } from '@/core/domain/models';
import { prisma } from '@/infrastructure/db/prisma';

export class PrismaPoolRepository implements IPoolRepository {
  async createPoolWithMembers(data: {
    year: number;
    membersData: Omit<PoolMember, 'id' | 'poolId' | 'createdAt' | 'pool'>[];
  }): Promise<{ pool: Pool; members: PoolMember[] }> {
    
    // Check if a pool for this year already exists
    let pool = await prisma.pool.findUnique({ where: { year: data.year } });

    if (pool) {
      // If it exists, delete old members and create new ones
      // This is a simple "replace" strategy for the demo
      await prisma.poolMember.deleteMany({ where: { poolId: pool.id } });
      
      const members = await Promise.all(
        data.membersData.map(memberData => 
          prisma.poolMember.create({
            data: {
              ...memberData,
              poolId: pool!.id
            }
          })
        )
      );
      return { pool, members };

    } else {
      // Create a new pool and its members in a transaction
      return prisma.$transaction(async (tx) => {
        const newPool = await tx.pool.create({
          data: {
            year: data.year,
          },
        });

        const newMembers = await Promise.all(
          data.membersData.map(memberData => 
            tx.poolMember.create({
              data: {
                ...memberData,
                poolId: newPool.id,
              },
            })
          )
        );

        return { pool: newPool, members: newMembers };
      });
    }
  }
}