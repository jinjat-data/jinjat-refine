import React, {useState} from "react";
import {HttpError, IResourceComponentsProps} from "@pankod/refine-core";
import {Edit} from "@pankod/refine-mui";
import {JinjatForm} from "jsonforms/JinjatForm";
import {Type, useSchema} from "components/hooks/useSchema";
import {JsonSchema} from "@jsonforms/core";

export const JinjatEdit: React.FC<IResourceComponentsProps> = ({name, options}) => {
    let analysis = options?.jinjat.resources.create;
    const [data, setData] = useState({});

    const {data: schema, isLoading, isError} = useSchema<JsonSchema, HttpError>({
        resource: analysis,
        config: {type: Type.REQUEST}
    })

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Something went wrong!</div>;
    }

    return (
        <Edit isLoading={false} saveButtonProps={null}>
            <JinjatForm data={data} schema={schema}/>
        </Edit>
    );
}