import React, { useState, useEffect } from 'react';
import { VStack, Box, Text, useColorModeValue } from '@chakra-ui/react';

import TimeRangeSelector from './TimeRangeSelector';
import CategoryCharts from './CategoryCharts';
import LineChartTrend from './LineChartTrend';
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
  const [timeRange, setTimeRange] = useState('本週');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [filteredTodos, setFilteredTodos] = useState(todos);
  const [startDate, setStartDate] = useState(null);
  const [endDateState, setEndDateState] = useState(null);

  useEffect(() => {
    const now = new Date();
    let startDate = null;
    let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    switch (timeRange) {
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

    setStartDate(startDate);
    setEndDateState(endDate);

    setFilteredTodos(
      todos.filter(todo => {
        // 如果要以deadline判斷區間：
        if (!todo.deadline) return false;  // 沒 deadline 的不算

        const dDate = new Date(todo.deadline);
        return dDate >= startDate && dDate <= endDate;
      })
    );

  }, [timeRange, customStart, customEnd, todos]);

  // 統計分類標籤數量
  const data = tags.map(tag => ({
    name: tag,
    value: filteredTodos.filter(t => t.tag === tag).length,
  }));

  // 已完成任務數
  const completedCount = filteredTodos.filter(t => t.complete).length;

  const now = new Date();

  // 提醒任務數（alert = true）
  const alertCount = filteredTodos.filter(t => t.alert === true).length;

  // 即將到期任務（3 天內且未完成）
  const soonDeadlineTodos = filteredTodos.filter(t => {
    if (!t.deadline) return false;
    const deadline = new Date(t.deadline);
    return (
      !t.complete &&
      deadline >= now &&
      deadline <= new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    );
  });

  // 逾期未完成任務（deadline 在現在之前且未完成）
  const overdueTodos = filteredTodos.filter(t => {
    if (!t.deadline || t.complete) return false; // 無 deadline 或已完成的不算逾期未完成
    const deadline = new Date(t.deadline);
    return deadline < now;
  });

  // 日期格式化
  const formatDate = date => `${date.getMonth() + 1}/${date.getDate()}`;

  // 截取期限分布統計
  const deadlineDistribution = {};
  filteredTodos.forEach(todo => {
    if (todo.deadline) {
      const dateKey = formatDate(new Date(todo.deadline));
      deadlineDistribution[dateKey] = (deadlineDistribution[dateKey] || 0) + 1;
    }
  });


  // 產生日期範圍（用於折線圖）
  const generateDateRange = () => {
    let start, end;
    const now = new Date();

    switch (timeRange) {
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

  // 折線圖資料：每天新增任務數
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

        {startDate && endDateState && (
          <Text fontSize="sm" color="gray.500" mt={2}>
            資料範圍：{startDate.toLocaleDateString()} ~ {endDateState.toLocaleDateString()}
          </Text>
        )}
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
    </VStack>
  );
}
