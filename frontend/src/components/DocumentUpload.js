import React, { useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  VStack,
  useToast,
  Text,
  Icon,
  Input,
  Center,
  Progress,
  useColorModeValue
} from '@chakra-ui/react';
import { FiUpload, FiFile } from 'react-icons/fi';

const DocumentUpload = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();
  const fileInputRef = useRef();
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Document uploaded successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setFile(null);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <VStack spacing={4}>
      <Box
        w="100%"
        p={10}
        border="2px dashed"
        borderColor={borderColor}
        borderRadius="lg"
        _hover={{ bg: hoverBg }}
        cursor="pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Center>
          <VStack spacing={2}>
            <Icon as={FiUpload} w={10} h={10} color="blue.500" />
            <Text fontSize="lg" fontWeight="medium">
              {file ? file.name : 'Click or drag files to upload'}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Supports PDF and TXT files
            </Text>
          </VStack>
        </Center>
        <Input
          ref={fileInputRef}
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".txt,.pdf"
          display="none"
        />
      </Box>
      {file && (
        <VStack w="100%" spacing={4}>
          <Box w="100%" p={4} borderRadius="md" bg={useColorModeValue('white', 'gray.700')} shadow="sm">
            <Icon as={FiFile} mr={2} />
            <Text display="inline">{file.name}</Text>
          </Box>
          <Button
            colorScheme="blue"
            onClick={handleUpload}
            isLoading={isUploading}
            loadingText="Uploading"
            w="full"
          >
            Upload Document
          </Button>
        </VStack>
      )}
      {isUploading && <Progress size="xs" isIndeterminate w="100%" />}
    </VStack>
  );
};

export default DocumentUpload;
