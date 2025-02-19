import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const createTheme = (primaryColor: string) => {
  return extendTheme({
    config,
    colors: {
      primary: {
        50: `${primaryColor}.50`,
        100: `${primaryColor}.100`,
        200: `${primaryColor}.200`,
        300: `${primaryColor}.300`,
        400: `${primaryColor}.400`,
        500: `${primaryColor}.500`,
        600: `${primaryColor}.600`,
        700: `${primaryColor}.700`,
        800: `${primaryColor}.800`,
        900: `${primaryColor}.900`,
      },
    },
    components: {
      Button: {
        defaultProps: {
          colorScheme: primaryColor,
        },
      },
      Switch: {
        defaultProps: {
          colorScheme: primaryColor,
        },
      },
      Checkbox: {
        defaultProps: {
          colorScheme: primaryColor,
        },
      },
      Progress: {
        defaultProps: {
          colorScheme: primaryColor,
        },
      },
    },
  });
};

export default createTheme;
