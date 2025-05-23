import React from 'react';
import {
  Box,
  Text,
  HStack,
} from '@chakra-ui/react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#3182ce', '#2f855a', '#d69e2e', '#dd6b20'];

export default function CategoryCharts({ data }) {
  return (
    <Box
      p={4}
      bg="inherit"
      rounded="md"
      boxShadow="md"
      textAlign="center"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        分類任務統計
      </Text>

      <PieChart width={300} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      <Box mt={8}>
        <BarChart
          width={300}
          height={250}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#3182ce" />
        </BarChart>
      </Box>
    </Box>
  );
}
