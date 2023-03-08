import React from 'react';
import {JsonForms} from '@jsonforms/react';
import {
    materialRenderers,
    materialCells,
} from '@jsonforms/material-renderers';
import {Box} from "@pankod/refine-mui";
import {generateJsonformModule} from "./util";
import {JsonSchema, UISchemaElement} from "@jsonforms/core";

let custom_modules = [{
    module: '@mui/material',
    export: 'Rating',
    name: 'rating'
}]

export interface JinjatJsonFormsInitStateProps {
    data: any;
    schema: JsonSchema;
    uischema?: UISchemaElement;
    readonly? : boolean;
    onChange?(value?: any): void;
}

export const JinjatForm: React.FC<JinjatJsonFormsInitStateProps> = (props, context) => {
    const renderers = [
        ...materialRenderers,
        ...custom_modules.map(generateJsonformModule),
    ];

    return (
        <Box
            component="form"
            sx={{display: "flex", flexDirection: "column"}}
            autoComplete="off">
            <JsonForms
                schema={props.schema}
                uischema={props.uischema}
                readonly={props.readonly}
                data={props.data}
                renderers={renderers}
                cells={materialCells}
                onChange={({data, errors}) => props.onChange && props.onChange(data)}
            />
        </Box>
    );
}

