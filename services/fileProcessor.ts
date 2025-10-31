
import { Transaction, EmployeeStat, ReportAnalysis } from '../types';

// This is required because we are loading xlsx from a CDN.
declare const XLSX: any;

const parseDate = (dateStr: string): Date | null => {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const parts = dateStr.split(' ')[0].split('.');
    if (parts.length === 3) {
        // DD.MM.YYYY
        const [day, month, year] = parts;
        // Years like '202!' are parsed as 202. We fix it to be 2020s.
        const fullYear = year.startsWith('202') ? parseInt(year.substring(0,4), 10) : parseInt(year, 10);
        return new Date(fullYear, parseInt(month) - 1, parseInt(day));
    }
    return null;
};

const parseNumber = (numStr: any): number => {
    if (typeof numStr === 'number') return numStr;
    if (typeof numStr === 'string') {
        // Handle cases like '1 234,56'
        const cleanedStr = numStr.replace(/\s/g, '').replace(',', '.');
        return parseFloat(cleanedStr);
    }
    return 0;
};


export const processFile = (file: File): Promise<{ transactions: Transaction[], analysis: ReportAnalysis }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json: any[] = XLSX.utils.sheet_to_json(worksheet);

                const transactions: Transaction[] = json
                    .map((row: any) => {
                        const date = parseDate(row['Дата']);
                        const employee = row['Комментарий']?.trim();
                        if (!date || !employee || row['Итого'] === undefined || row['Итого'] === null) {
                            return null;
                        }
                        return {
                            date,
                            total: parseNumber(row['Итого']),
                            operationType: (row['Тип операции'] || '').trim().toLowerCase(),
                            employee,
                        };
                    })
                    .filter((t): t is Transaction => t !== null && !isNaN(t.total));
                
                if (transactions.length === 0) {
                  throw new Error("Не найдено действительных транзакций в файле. Проверьте названия столбцов: 'Дата', 'Комментарий', 'Итого', 'Тип операции'.");
                }
                
                const analysis = analyzeData(transactions);
                resolve({ transactions, analysis });

            } catch (error) {
                console.error("Parsing error:", error);
                reject(new Error('Не удалось проанализировать файл XLSX. Убедитесь, что он имеет правильный формат и названия столбцов.'));
            }
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
};

const analyzeData = (transactions: Transaction[]): ReportAnalysis => {
    let totalNetExpenses = 0;
    let totalRefundsAmount = 0;
    let cardIssueCostLastWeek = 0;

    const employeeMap: { [key: string]: { totalSpent: number; transactionCount: number; refunds: number; cardIssueCost: number } } = {};
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let startDate = transactions.length > 0 ? transactions[0].date : new Date();
    let endDate = transactions.length > 0 ? transactions[0].date : new Date();

    transactions.forEach(tx => {
        if (tx.date < startDate) startDate = tx.date;
        if (tx.date > endDate) endDate = tx.date;

        if (!employeeMap[tx.employee]) {
            employeeMap[tx.employee] = { totalSpent: 0, transactionCount: 0, refunds: 0, cardIssueCost: 0 };
        }

        const employeeData = employeeMap[tx.employee];
        employeeData.transactionCount++;

        if (tx.operationType.includes('возврат')) {
            totalRefundsAmount += tx.total;
            totalNetExpenses -= tx.total;
            employeeData.refunds += tx.total;
        } else {
            totalNetExpenses += tx.total;
            employeeData.totalSpent += tx.total;
        }

        const isCardIssue = tx.operationType.includes('выпуск карты') || tx.operationType.includes('выпуск карти');
        
        if (isCardIssue) {
            employeeData.cardIssueCost += tx.total;
            if (tx.date > sevenDaysAgo) {
                cardIssueCostLastWeek += tx.total;
            }
        }
    });

    const employeeStats: EmployeeStat[] = Object.keys(employeeMap)
        .map(name => ({
            name,
            totalSpent: employeeMap[name].totalSpent,
            transactionCount: employeeMap[name].transactionCount,
            refunds: employeeMap[name].refunds,
            cardIssueCost: employeeMap[name].cardIssueCost,
        }))
        .sort((a, b) => b.totalSpent - a.totalSpent);

    return {
        totalNetExpenses,
        totalRefundsAmount,
        cardIssueCostLastWeek,
        employeeStats,
        totalTransactions: transactions.length,
        startDate,
        endDate,
    };
};