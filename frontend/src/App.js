import React, { useState } from 'react';
import { ChakraProvider, VStack, Container, Box, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import DocumentUpload from './components/DocumentUpload';
import QuestionInput from './components/QuestionInput';
import Answer from './components/Answer';

function App() {
  const [answer, setAnswer] = useState('');
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const headerBg = useColorModeValue('white', 'gray.700');

  return (
    <ChakraProvider>
      <Box minH="100vh" bg={bgColor}>
        <Box bg={headerBg} py={4} shadow="sm" mb={8}>
          <Container maxW="container.xl">
            <Heading size="lg" color="blue.500">Q&A Assistant</Heading>
            <Text mt={2} color="gray.500">Upload documents and ask questions about them</Text>
          </Container>
        </Box>
        <Container maxW="container.xl" py={10}>
          <VStack spacing={8} align="stretch">
            <DocumentUpload />
            <QuestionInput onAnswer={setAnswer} />
            <Answer answer={answer} />
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
