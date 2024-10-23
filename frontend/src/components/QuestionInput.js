import React, { useState } from 'react';
import { 
  Input, 
  Button, 
  VStack,
  useToast,
  InputGroup,
  InputRightElement,
  useColorModeValue
} from '@chakra-ui/react';
import { FiSend } from 'react-icons/fi';

const QuestionInput = ({ onAnswer }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const inputBg = useColorModeValue('white', 'gray.700');

  const handleAsk = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question }),
      });

      if (response.ok) {
        const data = await response.json();
        onAnswer(data.answer);
        setQuestion('');
      } else {
        throw new Error('Failed to get answer');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get answer',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <VStack spacing={4} width="100%">
      <InputGroup size="lg">
        <Input
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          bg={inputBg}
          pr="4.5rem"
          shadow="sm"
          _focus={{
            shadow: 'md',
            borderColor: 'blue.500'
          }}
        />
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="sm"
            onClick={handleAsk}
            isLoading={isLoading}
            colorScheme="blue"
            variant="ghost"
            _hover={{ bg: 'transparent' }}
          >
            <FiSend />
          </Button>
        </InputRightElement>
      </InputGroup>
    </VStack>
  );
};

export default QuestionInput;
