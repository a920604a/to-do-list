import React from 'react';
import {
  Box,
  Text,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export default function LineChartTrend({ data, timeRange }) {
  return (
    <Box
      p={4}
      bg="inherit"
      rounded="md"
      boxShadow="md"
    >
      <Text
        fontSize="xl"
        fontWeight="bold"
        mb={2}
        textAlign="center"
      >
        新增任務趨勢 ({timeRange})
      </Text>

      <LineChart
        width={350}
        height={250}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#d69e2e"
          strokeWidth={3}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </Box>
  );
}
