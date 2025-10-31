export interface Transaction {
  date: Date;
  total: number;
  operationType: string;
  employee: string;
}

export interface EmployeeStat {
  name: string;
  totalSpent: number;
  transactionCount: number;
  refunds: number;
  cardIssueCost: number;
}

export interface ReportAnalysis {
  totalNetExpenses: number;
  totalRefundsAmount: number;
  cardIssueCostLastWeek: number;
  employeeStats: EmployeeStat[];
  totalTransactions: number;
  startDate: Date;
  endDate: Date;
}