// components/CompletionRateChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';

const COLORS = ['#38A169', '#E53E3E']; // 綠色: 已完成, 紅色: 未完成

export default function CompletionRateChart({ completedCount, totalCount }) {
  const bg = useColorModeValue('gray.50', 'gray.700');

  const data = [
    { name: '已完成', value: completedCount },
    { name: '未完成', value: totalCount - completedCount },
  ];

  return (
    <Box p={6} bg={bg} rounded="md" boxShadow="md">
      <Text fontSize="lg" fontWeight="bold" mb={4}>✅ 完成率圖表</Text>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
