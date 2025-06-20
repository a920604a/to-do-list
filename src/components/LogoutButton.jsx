import React from "react";
import { Button } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("to-do-list-loginTimestamp");
      navigate("/");
    } catch (error) {
      console.error("登出失敗", error);
    }
  };

  return (
    <Button onClick={handleLogout} colorScheme="red" variant="outline">
      登出
    </Button>
  );
};

export default LogoutButton;
