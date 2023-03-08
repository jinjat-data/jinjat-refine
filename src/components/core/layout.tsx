import React from "react";
import { Box } from "@mui/material";

import { Header as DefaultHeader } from "./header";
import {RefineLayoutLayoutProps} from "@pankod/refine-mui";
import {JinjatSider} from "./Sider";

export const Layout: React.FC<RefineLayoutLayoutProps> = ({
                                                              Sider,
                                                              Header,
                                                              Footer,
                                                              OffLayoutArea,
                                                              children,
                                                          }) => {
    const SiderToRender = Sider ?? JinjatSider;
    const HeaderToRender = Header ?? DefaultHeader;

    return (
        <Box display="flex" flexDirection="row">
            <SiderToRender />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minHeight: "100vh",
                }}
            >
                <HeaderToRender />
                <Box
                    component="main"
                    sx={{
                        p: { xs: 1, md: 2, lg: 3 },
                        flexGrow: 1,
                        bgcolor: (theme) => theme.palette.background.default,
                    }}
                >
                    {children}
                </Box>
                {Footer && <Footer />}
            </Box>
            {OffLayoutArea && <OffLayoutArea />}
        </Box>
    );
};
