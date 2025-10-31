import React from 'react';

interface SummaryCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, color }) => {
    return (
        <div className="bg-slate-900/70 backdrop-blur-lg border border-slate-100/10 p-6 rounded-xl shadow-lg flex items-center space-x-4">
            <div className={`p-3 rounded-full bg-slate-800/80 ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-400 text-sm">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
};

export default SummaryCard;