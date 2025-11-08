import { IComplianceRepository } from '@/core/ports/IComplianceRepository';
import { ShipCompliance, BankEntry } from '@/core/domain/models';
import { prisma } from '@/infrastructure/db/prisma';

export class PrismaComplianceRepository implements IComplianceRepository {
  async findCompliance(shipId: string, year: number): Promise<ShipCompliance | null> {
    return prisma.shipCompliance.findUnique({
      where: { shipId_year: { shipId, year } },
    });
  }

  async upsertCompliance(data: {
    shipId: string;
    year: number;
    cb_gco2eq: number;
    cb_adjusted?: number;
  }): Promise<ShipCompliance> {
    return prisma.shipCompliance.upsert({
      where: { shipId_year: { shipId: data.shipId, year: data.year } },
      create: data,
      update: {
        cb_gco2eq: data.cb_gco2eq,
        cb_adjusted: data.cb_adjusted,
      },
    });
  }

  async findBankEntries(shipId: string, year: number): Promise<BankEntry[]> {
    return prisma.bankEntry.findMany({
      where: { shipId, year },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createBankEntry(data: {
    shipId: string;
    year: number;
    amount_gco2eq: number;
    type: 'bank' | 'apply';
  }): Promise<BankEntry> {
    return prisma.bankEntry.create({ data });
  }
}