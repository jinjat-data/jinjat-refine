import {
    AppBar,
    IconButton,
    Box,
    Stack, ThemeProvider, LightTheme, DarkTheme,
} from "@pankod/refine-mui";


import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {DarkModeOutlined, LightModeOutlined} from "@mui/icons-material";

type ColorModeContextType = {
    mode: string;
    setMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
    {} as ColorModeContextType,
);

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
                                                                          children,
                                                                      }) => {
    const colorModeFromLocalStorage = localStorage.getItem("colorMode");
    const isSystemPreferenceDark = window?.matchMedia(
        "(prefers-color-scheme: dark)",
    ).matches;

    const systemPreference = isSystemPreferenceDark ? "dark" : "light";
    const [mode, setMode] = useState(
        colorModeFromLocalStorage || systemPreference,
    );

    useEffect(() => {
        window.localStorage.setItem("colorMode", mode);
    }, [mode]);

    const setColorMode = () => {
        if (mode === "light") {
            setMode("dark");
        } else {
            setMode("light");
        }
    };

    return (
        <ColorModeContext.Provider
            value={{
                setMode: setColorMode,
                mode,
            }}
        >
            <ThemeProvider theme={mode === "light" ? LightTheme : DarkTheme}>
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export const Header = () => {
    const { mode, setMode } = useContext(ColorModeContext);
    return (
        <AppBar color="default" position="sticky">
                <Box marginRight="20px">
                    <IconButton
                        onClick={() => {
                            setMode();
                        }}
                    >
                        {mode === "dark" ? (
                            <LightModeOutlined />
                        ) : (
                            <DarkModeOutlined />
                        )}
                    </IconButton>
                </Box>
        </AppBar>
    );
};