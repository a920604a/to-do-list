import { useState } from 'react';
import { auth, provider, signInWithPopup } from '../utils/firebase';
import { Button, Text, Box, Center, Heading } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Google Icon (可自行換圖)
const GoogleIcon = () => (
  <svg className="h-5 w-5 mr-2" viewBox="0 0 533.5 544.3">
    <path fill="#4285f4" d="M533.5 278.4c0-17.3-1.4-34-4.1-50.3H272v95.1h146.9c-6.4 34.7-25.7 64.1-54.6 83.6l88.2 68.5c51.4-47.3 80.9-117 80.9-196.9z"/>
    <path fill="#34a853" d="M272 544.3c73.7 0 135.6-24.4 180.8-66.2l-88.2-68.5c-24.5 16.4-55.9 26-92.6 26-71.2 0-131.5-48.1-153.1-112.8H27.6v70.8C72.9 477.1 166.7 544.3 272 544.3z"/>
    <path fill="#fbbc04" d="M118.9 322.7c-10.6-31.3-10.6-65.3 0-96.6V155.3H27.6c-34.6 69.3-34.6 150.4 0 219.7l91.3-70.8z"/>
    <path fill="#ea4335" d="M272 107.7c39.9 0 75.9 13.7 104.3 40.6l78.1-78.1C407.6 24.4 345.7 0 272 0 166.7 0 72.9 67.2 27.6 155.3l91.3 70.8C140.5 155.8 200.8 107.7 272 107.7z"/>
  </svg>
);

const Alert = ({ message }) => (
  <Box mb={4} bg="orange.50" borderLeft="4px solid" borderColor="orange.500" p={4} color="orange.700" borderRadius="lg">
    <Text>{message}</Text>
  </Box>
);

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('登入成功：', user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google 登入錯誤：', err);
      setError('登入失敗，請稍後再試。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Center minHeight="100vh" bgGradient="linear(to-br, teal.50, blue.200)">
      <Box w="full" maxW="xs" p={4} textAlign="center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
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
            _hover={{ shadow: 'xl' }}
          >
            <Text fontSize="lg" fontWeight="semibold" color="gray.800" mb={6}>
              使用 Google 帳戶登入
            </Text>

            {error && <Alert message={error} />}

            <Button
              onClick={handleGoogleLogin}
              isLoading={isLoading}
              loadingText="登入中..."
              colorScheme="teal"
              variant="solid"
              w="full"
              leftIcon={<GoogleIcon />}
              mb={4}
              _hover={{ bg: 'teal.700' }}
              aria-label="使用 Google 登入"
            >
              使用 Google 登入
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
