import React from 'react';
import { View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

interface ExpenseChartProps {
  data: { category: string; amount: number }[];
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ data }) => {
  // Format data for PieChart - expects { name, population, color }
  const chartData = {
    labels: data.map(d => d.category),
    datasets: [
      {
        data: data.map(d => d.amount),
      },
    ],
  };

  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
  ];

  return (
    <View>
      <PieChart
        data={{
          labels: data.map(d => d.category),
          datasets: [
            {
              data: data.map(d => d.amount),
            },
          ],
        } as any}
        width={350}
        height={220}
        chartConfig={{
          color: () => '#fff',
        }}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
      />
    </View>
  );
};