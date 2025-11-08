import { Pool, PoolMember } from '../domain/models';

export interface IPoolRepository {
  createPoolWithMembers(data: {
    year: number;
    membersData: Omit<PoolMember, 'id' | 'poolId' | 'createdAt' | 'pool'>[];
  }): Promise<{ pool: Pool; members: PoolMember[] }>;
}