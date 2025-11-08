import { ShipCompliance, BankEntry } from '../domain/models';

export interface IComplianceRepository {
  findCompliance(shipId: string, year: number): Promise<ShipCompliance | null>;
  upsertCompliance(data: {
    shipId: string;
    year: number;
    cb_gco2eq: number;
    cb_adjusted?: number;
  }): Promise<ShipCompliance>;
  findBankEntries(shipId: string, year: number): Promise<BankEntry[]>;
  createBankEntry(data: {
    shipId: string;
    year: number;
    amount_gco2eq: number;
    type: 'bank' | 'apply';
  }): Promise<BankEntry>;
}