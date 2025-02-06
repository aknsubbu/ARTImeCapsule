import { User, AuthResponse } from "../types/index";

class AuthController {
  private static instance: AuthController;
  private token: string | null = null;
  private currentUser: User | null = null;

  private constructor() {}

  static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Implement your login logic here
      // This is a placeholder that you'll replace with your backend call
      return {
        user: null,
        token: null,
        error: "Not implemented",
      };
    } catch (error) {
      return {
        user: null,
        token: null,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async logout(): Promise<void> {
    this.token = null;
    this.currentUser = null;
    // Implement any cleanup needed
  }

  getToken(): string | null {
    return this.token;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

export default AuthController;
