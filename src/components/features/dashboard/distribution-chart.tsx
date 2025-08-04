
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useTheme } from "next-themes";

interface DistributionChartProps {
  income: number;
  expenses: number;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent === 0) {
    return null;
  }

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export function DistributionChart({ income, expenses }: DistributionChartProps) {
  const { theme } = useTheme();
  
  const data = [
    { name: "Receitas", value: income },
    { name: "Despesas", value: expenses },
  ];

  const COLORS = ["#10B981", "#EF4444"]; // Green for income, Red for expenses

  if (income <= 0 && expenses <= 0) {
    return (
        <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            Sem dados para exibir o gráfico.
        </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
            formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
            contentStyle={{
                backgroundColor: theme === 'dark' ? '#333' : '#fff',
                borderColor: theme === 'dark' ? '#555' : '#ccc',
                borderRadius: '0.5rem'
            }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
