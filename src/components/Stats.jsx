import React, { useState, useEffect } from 'react';
import { VStack, Box, Text, useColorModeValue } from '@chakra-ui/react';

import TimeRangeSelector from './TimeRangeSelector';
import CategoryCharts from './CategoryCharts';
import LineChartTrend from './LineChartTrend';

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

export default function Stats({ todos, tags }) {
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

  // 分類統計資料（圓餅 & 長條共用）
  const data = tags.map((tag) => ({
    name: tag,
    value: filteredTodos.filter((t) => t.tag === tag).length,
  }));

  // 已完成任務數
  const completedCount = filteredTodos.filter((t) => t.complete).length;

  // 日期格式化
  const formatDate = (date) => `${date.getMonth() + 1}/${date.getDate()}`;

  // 產生範圍內日期陣列
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
          break;  // 有條件的 break
        } else {
          // 這裡補上 break，避免 fallthrough
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

  // 計算每天新增任務數
  const lineData = pastDays.map((day) => {
    const count = filteredTodos.filter((todo) => {
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
      <Box
        p={6}
        bg={bgCard}
        rounded="md"
        boxShadow="md"
        textAlign="center"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={3}>
          任務總覽 ({timeRange})
        </Text>
        <Text fontSize="md" mb={1}>總任務數：{filteredTodos.length}</Text>
        <Text fontSize="md">已完成任務數：{completedCount}</Text>
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

      <LineChartTrend data={lineData} timeRange={timeRange} />
    </VStack>
  );
}