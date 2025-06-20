import React, { useEffect } from "react";
import { Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";


const MotionFlex = motion(Flex);

const LoginPage = () => {
  const navigate = useNavigate();

  // ✅ 如果已登入，自動跳轉 Dashboard
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          navigate("/dashboard");
        }
      });
      return () => unsubscribe();
    }, [navigate]);

    const handleLogin = async () => {
      try {
        await signInWithPopup(auth, provider);
        localStorage.setItem("to-do-list-loginTimestamp", Date.now().toString());

        navigate("/dashboard"); // ✅ 登入成功後導向 Dashboard
      } catch (error) {
        console.error("登入失敗", error);
      }
    };

  return (
    <MotionFlex
      direction="column"
      align="center"
      justify="center"
      height="100vh"
      bg="teal.500"
      color="white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <VStack spacing={6}>
        <Heading size="2xl" textAlign="center">
            我的代辦清單
        </Heading>
        <Text fontSize="lg" textAlign="center">
            登入後管理你的任務，讓生活更有效率
        </Text>
        <Button colorScheme="whiteAlpha" size="lg" onClick={handleLogin}>
          使用 Google 登入
        </Button>
      </VStack>
    </MotionFlex>
  );
};

export default LoginPage;