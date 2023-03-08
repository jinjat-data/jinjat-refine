import React, {useState} from "react";
import {HttpError, IResourceComponentsProps} from "@pankod/refine-core";
import {Create} from "@pankod/refine-mui";
import {JinjatForm} from "jsonforms/JinjatForm";
import {Type, useSchema} from "components/hooks/useSchema";
import {JsonSchema} from "@jsonforms/core";

export const JinjatCreate: React.FC<IResourceComponentsProps> = ({name, options}) => {
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
        <Create isLoading={false} saveButtonProps={null}>
            <JinjatForm data={data} schema={schema}/>
        </Create>
    );
}