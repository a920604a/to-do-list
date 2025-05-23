import React from 'react';
import { HStack, Button, Box, Text, Input } from '@chakra-ui/react';

export default function TimeRangeSelector({
  timeRange,
  setTimeRange,
  customStart,
  setCustomStart,
  customEnd,
  setCustomEnd,
  btnActive,
  btnInactive,
}) {
  return (
    <>
      <HStack mb={4} justifyContent="center" spacing={2}>
        {['今日', '本週', '本月', '本季', '今年', '自訂'].map((label) => (
          <Button
            key={label}
            size="sm"
            onClick={() => setTimeRange(label)}
            bg={timeRange === label ? btnActive : btnInactive}
            color={timeRange === label ? 'white' : 'gray.700'}
            _hover={{
              bg: timeRange === label ? btnActive : 'gray.400',
              color: 'white',
            }}
          >
            {label}
          </Button>
        ))}
      </HStack>

      {timeRange === '自訂' && (
        <HStack spacing={3} mb={4} justifyContent="center">
          <Box>
            <Text fontSize="sm" mb={1} textAlign="center">
              開始日期
            </Text>
            <Input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              max={customEnd || undefined}
            />
          </Box>
          <Box>
            <Text fontSize="sm" mb={1} textAlign="center">
              結束日期
            </Text>
            <Input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              min={customStart || undefined}
              max={new Date().toISOString().split('T')[0]}
            />
          </Box>
        </HStack>
      )}
    </>
  );
}
