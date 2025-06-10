import React, { useState } from 'react';
import { VStack, Box, Text, useColorModeValue } from '@chakra-ui/react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, List, ListItem, Badge } from '@chakra-ui/react';

import TimeRangeSelector from './TimeRangeSelector';
import CategoryCharts from './CategoryCharts';
import LineChartTrend from './LineChartTrend';
import CompletionRateChart from './CompletionRateChart';

import useStatsView from '../hooks/useStatsView';

export default function StatsView({ todos, tags }) {
  const [timeRange, setTimeRange] = useState('本週');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const {
    filteredTodos,
    startDate,
    endDateState,
    data,
    completedCount,
    alertCount,
    soonDeadlineTodos,
    overdueTodos,
    lineData,
  } = useStatsView(todos, tags, timeRange, customStart, customEnd);

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
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" fontWeight="bold">
              已完成任務詳細列表 ({completedCount})
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4} maxH="300px" overflowY="auto">
            {completedCount === 0 ? (
              <Text>無已完成任務</Text>
            ) : (
              <List spacing={3}>
                {filteredTodos
                  .filter(t => t.complete)
                  .map(todo => (
                    <ListItem key={todo.id} borderBottom="1px solid" borderColor="gray.200" py={2}>
                      <Text fontWeight="medium">{todo.title}</Text>
                      <Text fontSize="sm" color="gray.500">
                        完成時間: {todo.updated_at ? new Date(todo.updated_at).toLocaleString() : '未知'}
                      </Text>
                      <Badge colorScheme="blue">{todo.tag}</Badge>
                    </ListItem>
                  ))}
              </List>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
}
