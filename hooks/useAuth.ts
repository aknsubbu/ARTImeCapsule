import { useState, useEffect } from "react";
import { User, AuthResponse } from "../types/index";
import AuthController from "../controllers/authController";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = AuthController.getInstance();

  useEffect(() => {
    // Check for existing session
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await auth.login(email, password);
      if (response.user) {
        setUser(response.user);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await auth.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    login,
    logout,
  };
}
