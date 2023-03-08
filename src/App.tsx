import React from "react";

import {Refine} from "@pankod/refine-core";
import {
    notificationProvider,
    RefineSnackbarProvider,
    CssBaseline,
    GlobalStyles,
    Layout,
    ThemeProvider,
    LightTheme,
    ReadyPage,
    ErrorComponent,
    useMediaQuery, DarkTheme, AuthPage, Box, ListItemText
} from "@pankod/refine-mui";

import routerProvider from "@pankod/refine-react-router-v6";
import {AutoAwesome} from "@mui/icons-material";
import {dataProvider} from "./data-provider/provider";
import {Analysis} from "./components/Analysis";
import {JinjatContextProvider} from "components/hooks/useSchemaProvider";
import {jinjatProvider} from "components/hooks/schema";
import {useJinjatProject} from "./components/hooks/useJinjatProject";
import {createResources} from "./refine/createResources";
import {ColorModeContextProvider, Header} from "./components/core/header";
import {JinjatSider} from "./components/core/Sider";


function App() {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    let dataContext = dataProvider("http://127.0.0.1:8581");
    const jinjatContext = jinjatProvider("http://127.0.0.1:8581");

    const {data: project, isLoading, error} = useJinjatProject({schemaContext: jinjatContext});

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error != null) {
        return <div>Something went wrong!</div>;
    }

    return (
        <ThemeProvider theme={prefersDarkMode ? DarkTheme : LightTheme}>
            <ColorModeContextProvider>
                <CssBaseline/>
                <GlobalStyles styles={{html: {WebkitFontSmoothing: "auto"}}}/>
                <RefineSnackbarProvider>
                    <JinjatContextProvider {...jinjatContext}>
                        <Refine
                            dataProvider={dataContext}
                            notificationProvider={notificationProvider}
                            ReadyPage={ReadyPage}
                            LoginPage={AuthPage}
                            resources={createResources(project!!)}
                            catchAll={<ErrorComponent/>}
                            Sider={JinjatSider}
                            Layout={Layout}
                            routerProvider={{
                                ...routerProvider,
                                routes: [
                                    {
                                        element: <Analysis/>,
                                        path: "/_analysis/:package_name/:analysis_name",
                                    },
                                ],
                            }}
                        />
                    </JinjatContextProvider>
                </RefineSnackbarProvider>
            </ColorModeContextProvider>
        </ThemeProvider>
    );
}

export default App;
