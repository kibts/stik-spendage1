import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EmployeeStat } from '../types';

interface EmployeeSpendChartProps {
    data: EmployeeStat[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111827] p-4 rounded-lg border border-[#374151] shadow-xl">
        <p className="label font-bold text-sky-400">{`${label}`}</p>
        <p className="text-green-400">{`Всего потрачено: $${payload[0].value.toFixed(2)}`}</p>
        <p className="text-gray-300">{`Транзакций: ${payload[0].payload.transactionCount}`}</p>
      </div>
    );
  }
  return null;
};


const EmployeeSpendChart: React.FC<EmployeeSpendChartProps> = ({ data }) => {
    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${value}`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(31, 41, 55, 0.5)' }}/>
                    <Legend wrapperStyle={{ color: '#d1d5db' }} formatter={(value) => "Всего потрачено ($)"} />
                    <Bar dataKey="totalSpent" fill="#0ea5e9" name="Всего потрачено ($)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EmployeeSpendChart;
