import React, {ReactNode, useContext, useMemo} from "react";

import {IJinjatContextProvider} from "./schema";

export const defaultSchemaProvider = () => {
    return {
        getResponseSchema: () => Promise.resolve({data: {type: "string"}}),
        getRequestSchema: () => Promise.resolve({data: {type: "string"}}),
        getProject: () => Promise.resolve({resources: [], version: 'LOADING'}),
        getApiUrl: () => "",
    } as unknown as IJinjatContextProvider;
};


const SchemaContext = React.createContext<IJinjatContextProvider>(defaultSchemaProvider());

export const JinjatContextProvider: React.FC<(IJinjatContextProvider & {
    children: ReactNode;
})> = ({ children, ...rest }) => {
    return (
        <SchemaContext.Provider value={rest}>
            {children}
        </SchemaContext.Provider>
    );
};

export const useSchemaProvider = () => {
    return useContext<IJinjatContextProvider>(SchemaContext);
};
