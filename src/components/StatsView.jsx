import React, { useState, useEffect } from 'react';
import { VStack, Box, Text, useColorModeValue } from '@chakra-ui/react';

import TimeRangeSelector from './TimeRangeSelector';
import CategoryCharts from './CategoryCharts';
import LineChartTrend from './LineChartTrend';
import DeadlineBarChart from './DeadlineBarChart';
import CompletionRateChart from './CompletionRateChart';

// 時間區間輔助函式
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function getStartOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getStartOfQuarter(date) {
  const month = date.getMonth();
  const quarterStartMonth = Math.floor(month / 3) * 3;
  return new Date(date.getFullYear(), quarterStartMonth, 1);
}

function getStartOfYear(date) {
  return new Date(date.getFullYear(), 0, 1);
}

export default function StatsView({ todos, tags }) {
  const [timeRange, setTimeRange] = useState('今日');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [filteredTodos, setFilteredTodos] = useState(todos);

  useEffect(() => {
    const now = new Date();
    let startDate = null;
    let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    switch (timeRange) {
      case '今日':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case '本週':
        startDate = getStartOfWeek(now);
        break;
      case '本月':
        startDate = getStartOfMonth(now);
        break;
      case '本季':
        startDate = getStartOfQuarter(now);
        break;
      case '今年':
        startDate = getStartOfYear(now);
        break;
      case '自訂':
        if (customStart && customEnd) {
          startDate = new Date(customStart);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(customEnd);
          endDate.setHours(23, 59, 59, 999);
        } else {
          setFilteredTodos(todos);
          return;
        }
        break;
      default:
        setFilteredTodos(todos);
        return;
    }

    setFilteredTodos(
      todos.filter(todo => {
        const cDate = new Date(todo.created_at);
        return cDate >= startDate && cDate <= endDate;
      })
    );
  }, [timeRange, customStart, customEnd, todos]);

  const data = tags.map(tag => ({
    name: tag,
    value: filteredTodos.filter(t => t.tag === tag).length,
  }));

  const completedCount = filteredTodos.filter(t => t.complete).length;

  const now = new Date();

  // 額外統計分析
  const alertCount = filteredTodos.filter(t => t.alert === true).length;
  const noAlertCount = filteredTodos.length - alertCount;

  const soonDeadlineTodos = filteredTodos.filter(t => {
    const deadline = new Date(t.deadline);
    return (
      !t.complete &&
      deadline >= now &&
      deadline <= new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    );
  });

  const overdueTodos = filteredTodos.filter(t => {
    const deadline = new Date(t.deadline);
    return !t.complete && deadline < now;
  });

  const formatDate = date => `${date.getMonth() + 1}/${date.getDate()}`;

  // deadline 分布圖表資料
  const deadlineDistribution = {};
  filteredTodos.forEach(todo => {
    if (todo.deadline) {
      const dateKey = formatDate(new Date(todo.deadline));
      deadlineDistribution[dateKey] = (deadlineDistribution[dateKey] || 0) + 1;
    }
  });

  const deadlineChartData = Object.entries(deadlineDistribution).map(([date, count]) => ({
    date,
    count,
  }));

  const generateDateRange = () => {
    let start, end;
    const now = new Date();

    switch (timeRange) {
      case '今日':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(start);
        break;
      case '本週':
        start = getStartOfWeek(now);
        end = now;
        break;
      case '本季':
        start = getStartOfQuarter(now);
        end = now;
        break;
      case '本月':
        start = getStartOfMonth(now);
        end = now;
        break;
      case '今年':
        start = getStartOfYear(now);
        end = now;
        break;
      case '自訂':
        if (customStart && customEnd) {
          start = new Date(customStart);
          end = new Date(customEnd);
          break;
        } else {
          break;
        }
      default:
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = now;
    }

    const dates = [];
    let current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const pastDays = generateDateRange();

  const lineData = pastDays.map(day => {
    const count = filteredTodos.filter(todo => {
      const cDate = new Date(todo.created_at);
      return (
        cDate.getFullYear() === day.getFullYear() &&
        cDate.getMonth() === day.getMonth() &&
        cDate.getDate() === day.getDate()
      );
    }).length;
    return { date: formatDate(day), count };
  });

  const bgCard = useColorModeValue('gray.50', 'gray.700');
  const btnActive = useColorModeValue('blue.500', 'blue.300');
  const btnInactive = useColorModeValue('gray.300', 'gray.600');

  return (
    <VStack spacing={8} align="stretch" maxW="900px" mx="auto" px={6} py={6}>
      <Box p={6} bg={bgCard} rounded="md" boxShadow="md" textAlign="center">
        <Text fontSize="2xl" fontWeight="bold" mb={3}>
          任務總覽 ({timeRange})
        </Text>
        <Text fontSize="md" mb={1}>總任務數：{filteredTodos.length}</Text>
        <Text fontSize="md" mb={3}>已完成任務數：{completedCount}</Text>
        <Text fontSize="md" color="teal.500">🔔 提醒任務：{alertCount} / {filteredTodos.length}</Text>
        <Text fontSize="md" color="orange.500">⚠️ 即將到期任務：{soonDeadlineTodos.length}</Text>
        <Text fontSize="md" color="red.500">❗ 逾期未完成任務：{overdueTodos.length}</Text>
      </Box>

      <Box p={6} bg={bgCard} rounded="md" boxShadow="md">
        <TimeRangeSelector
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          customStart={customStart}
          setCustomStart={setCustomStart}
          customEnd={customEnd}
          setCustomEnd={setCustomEnd}
          btnActive={btnActive}
          btnInactive={btnInactive}
        />
        <CategoryCharts data={data} />
      </Box>
      <CompletionRateChart completedCount={completedCount} totalCount={filteredTodos.length} />

      <LineChartTrend data={lineData} timeRange={timeRange} />
      <DeadlineBarChart data={deadlineChartData} />
    </VStack>
  );
}
