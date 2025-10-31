import React from 'react';
import { ReportAnalysis } from '../types';
import SummaryCard from './SummaryCard';
import EmployeeDataTable from './EmployeeDataTable';
import { CashIcon, RefreshIcon, CreditCardIcon, DocumentReportIcon } from './icons';

interface DashboardProps {
    reportData: ReportAnalysis;
    onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ reportData, onReset }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    title="Чистые расходы"
                    value={`$${reportData.totalNetExpenses.toFixed(2)}`}
                    icon={<CashIcon />}
                    color="text-green-400"
                />
                <SummaryCard
                    title="Обработанные возвраты"
                    value={`-$${reportData.totalRefundsAmount.toFixed(2)}`}
                    icon={<RefreshIcon />}
                    color="text-yellow-400"
                />
                <SummaryCard
                    title="Выпуск карт (7 дн.)"
                    value={`$${reportData.cardIssueCostLastWeek.toFixed(2)}`}
                    icon={<CreditCardIcon />}
                    color="text-sky-400"
                />
                <SummaryCard
                    title="Всего транзакций"
                    value={reportData.totalTransactions.toString()}
                    icon={<DocumentReportIcon />}
                    color="text-indigo-400"
                />
            </div>

            <div className="grid grid-cols-1 gap-8">
               <EmployeeDataTable 
                    data={reportData.employeeStats} 
                    startDate={reportData.startDate}
                    endDate={reportData.endDate}
                />
            </div>

            <div className="text-center">
                <button
                    onClick={onReset}
                    className="bg-slate-700/50 hover:bg-slate-600/50 backdrop-blur-md border border-slate-100/10 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
                >
                    Анализировать другой файл
                </button>
            </div>
        </div>
    );
};

export default Dashboard;