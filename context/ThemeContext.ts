import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import { Theme, ThemeContextType } from "./theme/types";
import { lightColors, darkColors } from "./theme/themes";

const defaultTheme: Theme = {
  dark: false,
  colors: lightColors,
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(systemColorScheme === "dark");

  const theme: Theme = {
    dark: isDark,
    colors: isDark ? darkColors : lightColors,
  };

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    persistThemePreference(isDark);
  }, [isDark]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme !== null) {
        setIsDark(savedTheme === "dark");
      } else {
        // If no saved preference, use system preference
        setIsDark(systemColorScheme === "dark");
      }
    } catch (error) {
      console.error("Error loading theme preference:", error);
    }
  };

  const persistThemePreference = async (dark: boolean) => {
    try {
      await AsyncStorage.setItem("theme", dark ? "dark" : "light");
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const setTheme = (mode: "light" | "dark") => {
    setIsDark(mode === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
