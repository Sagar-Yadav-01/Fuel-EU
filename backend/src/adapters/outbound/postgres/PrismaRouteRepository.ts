import { IRouteRepository } from '@/core/ports/IRouteRepository';
import { Route } from '@/core/domain/models';
import { prisma } from '@/infrastructure/db/prisma';
import { Prisma } from '@prisma/client';

export class PrismaRouteRepository implements IRouteRepository {
  async findAll(): Promise<Route[]> {
    return prisma.route.findMany({
      orderBy: [{ year: 'desc' }, { routeId: 'asc' }],
    });
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    return prisma.route.findUnique({ where: { routeId } });
  }

  async setBaseline(routeId: string): Promise<Route> {
    const route = await this.findByRouteId(routeId);
    if (!route) {
      throw new Error('Route not found');
    }

    // Transaction to set all other routes for this ship/year to false,
    // and this one to true.
    return prisma.$transaction(async (tx) => {
      await tx.route.updateMany({
        where: {
          shipId: route.shipId,
          year: route.year,
          NOT: { routeId: routeId },
        },
        data: { isBaseline: false },
      });

      const newBaseline = await tx.route.update({
        where: { routeId: routeId },
        data: { isBaseline: true },
      });

      return newBaseline;
    });
  }

  async findBaseline(shipId: string, year: number): Promise<Route | null> {
    return prisma.route.findFirst({
      where: { shipId, year, isBaseline: true },
    });
  }

  async findRoutesForComparison(shipId: string, year: number): Promise<Route[]> {
    return prisma.route.findMany({
      where: { shipId, year, isBaseline: false },
      orderBy: { routeId: 'asc' },
    });
  }

  async findAllByShipAndYear(shipId: string, year: number): Promise<Route[]> {
    return prisma.route.findMany({
      where: { shipId, year },
      orderBy: { routeId: 'asc' },
    });
  }
}