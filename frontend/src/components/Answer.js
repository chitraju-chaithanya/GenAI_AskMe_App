import React from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';

const Answer = ({ answer }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (!answer) return null;

  return (
    <Box 
      p={6} 
      bg={bgColor} 
      borderRadius="lg" 
      border="1px" 
      borderColor={borderColor}
      shadow="sm"
      width="100%"
    >
      <Text fontSize="md" lineHeight="tall">
        {answer}
      </Text>
    </Box>
  );
};

export default Answer;
