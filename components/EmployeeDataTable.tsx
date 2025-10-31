import React from 'react';
import { EmployeeStat } from '../types';

interface EmployeeDataTableProps {
    data: EmployeeStat[];
    startDate: Date;
    endDate: Date;
}

const formatDate = (date: Date): string => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}

const EmployeeDataTable: React.FC<EmployeeDataTableProps> = ({ data, startDate, endDate }) => {
    return (
        <div className="bg-slate-900/70 backdrop-blur-lg border border-slate-100/10 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100/10 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Расходы по сотрудникам</h2>
                {startDate && endDate && (
                     <p className="text-sm text-gray-400">
                        Период: <span className="font-medium text-gray-300">{formatDate(startDate)} - {formatDate(endDate)}</span>
                    </p>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-800/50">
                        <tr>
                            <th className="p-4 font-semibold text-gray-300 tracking-wider uppercase text-sm">Сотрудник</th>
                            <th className="p-4 font-semibold text-gray-300 tracking-wider uppercase text-sm text-center">Транзакции</th>
                            <th className="p-4 font-semibold text-gray-300 tracking-wider uppercase text-sm text-right">Расходы с учетом комиссии</th>
                            <th className="p-4 font-semibold text-gray-300 tracking-wider uppercase text-sm text-right">Возвраты</th>
                            <th className="p-4 font-semibold text-gray-300 tracking-wider uppercase text-sm text-right">Потрачено на выпуск карт</th>
                            <th className="p-4 font-semibold text-gray-300 tracking-wider uppercase text-sm text-right">Чистые расходы с учетом комиссии</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((employee) => (
                            <tr key={employee.name} className="border-t border-slate-100/10 hover:bg-slate-800/40 transition-colors duration-200">
                                <td className="p-4 font-medium text-white">{employee.name}</td>
                                <td className="p-4 text-center text-gray-300">{employee.transactionCount}</td>
                                <td className="p-4 text-right text-red-400 font-mono">${employee.totalSpent.toFixed(2)}</td>
                                <td className="p-4 text-right text-green-400 font-mono">${employee.refunds.toFixed(2)}</td>
                                <td className="p-4 text-right text-yellow-400 font-mono">${employee.cardIssueCost.toFixed(2)}</td>
                                <td className="p-4 text-right font-bold text-sky-400 font-mono">${(employee.totalSpent - employee.refunds).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeDataTable;