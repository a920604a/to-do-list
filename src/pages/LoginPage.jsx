import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { Button, Text, Box, Center, Heading } from '@chakra-ui/react';
import { motion } from 'framer-motion';

// GitHub Icon
const GitHubIcon = () => (
  <svg
    className="h-5 w-5 mr-2"
    aria-hidden="true"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
      clipRule="evenodd"
    />
  </svg>
);

// Error Alert
const Alert = ({ message }) => (
  <Box
    mb={4}
    bg="orange.50"
    borderLeft="4px solid"
    borderColor="orange.500"
    p={4}
    color="orange.700"
    borderRadius="lg"
    animation="fade-in 0.5s"
  >
    <Text>{message}</Text>
  </Box>
);

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          // redirectTo: 'http://localhost:3000/to-do-list/dashboard',
          // redirectTo: 'https://a920604a.github.io/to-do-list/dashboard',
          redirectTo: 'https://a920604a.github.io/to-do-list/#/dashboard',

        },
      });

      if (error) {
        console.error('GitHub login failed:', error.message);
        setError(error.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('發生意外錯誤，請重試。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center minHeight="100vh" bgGradient="linear(to-br, teal.50, blue.200)">
      <Box w="full" maxW="xs" p={4} textAlign="center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Heading as="h1" size="lg" mb={2} color="gray.900">
            我的代辦清單
          </Heading>
          <Text fontSize="xl" color="gray.700" mb={6}>
            登入後管理你的任務，讓生活更有效率
          </Text>

          <Box
            bg="whiteAlpha.800"
            backdropFilter="blur(10px)"
            p={6}
            shadow="lg"
            borderRadius="xl"
            borderColor="teal.300"
            borderWidth={1}
            transition="all 0.3s"
            _hover={{ shadow: 'xl' }}
          >
            <Text fontSize="lg" fontWeight="semibold" color="gray.800" mb={6}>
              使用 GitHub 帳戶登入
            </Text>

            {error && <Alert message={error} />}

            <Button
              onClick={handleGitHubLogin}
              isLoading={isLoading}
              loadingText="登入中..."
              colorScheme="teal"
              variant="solid"
              w="full"
              leftIcon={<GitHubIcon />}
              mb={4}
              _hover={{ bg: 'teal.700' }}
              aria-label="使用 GitHub 登入"
            >
              使用 GitHub 登入
            </Button>

            <Text fontSize="sm" color="gray.500">
              登入即表示你同意我們的服務條款和隱私政策。
            </Text>
          </Box>
        </motion.div>
      </Box>
    </Center>
  );
}

export default LoginPage;
