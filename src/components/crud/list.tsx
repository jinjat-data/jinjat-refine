import React from "react";
import {
    List,
    DataGrid,
    useDataGrid,
    GridColumns, GridValueFormatterParams, EditButton, ShowButton, DeleteButton,
} from "@pankod/refine-mui";
import {HttpError, IResourceComponentsProps, Option} from "@pankod/refine-core";
import {Type, useSchema} from "components/hooks/useSchema";
import {JsonSchema} from "@jsonforms/core";
import {GridNativeColTypes} from "@mui/x-data-grid/models/colDef/gridColType";
import {GridEnrichedColDef} from "@mui/x-data-grid/models/colDef/gridColDef";

export const JinjatList: React.FC<IResourceComponentsProps> = ({name, options}) => {
    let analysis = options?.jinjat.resources.list;
    const {dataGridProps} = useDataGrid({
        initialCurrent: 1,
        initialPageSize: 25,
        initialSorter: [
            {
                field: "title",
                order: "asc",
            },
        ],
        initialFilter: [
            {
                field: "status",
                operator: "eq",
                value: "draft",
            },
        ],
        syncWithLocation: true,
    });

    const {data : schema, isLoading, isError} = useSchema<JsonSchema, HttpError>({
        resource: analysis,
        config: {type: Type.RESPONSE}
    })

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Something went wrong!</div>;
    }
    const getDataGridType = (jinjatType : string) : GridNativeColTypes => {
        return 'string'
    }

    // @ts-ignore
    let rowIdColumn = schema.items['x-pk'];
    // @ts-ignore
    let properties = schema.items?.properties;
    const fieldColumns = Object.entries(properties).map(([key, value]) => (
            {
                field: key,
                // @ts-ignore
                headerName: value.label || key,
                // @ts-ignore
                type: getDataGridType(value.type),
                headerAlign: rowIdColumn == key ? "left" : undefined,
                align: rowIdColumn == key ? "left" : undefined,
                valueOptions: options,
                flex: 1,
                valueFormatter: (params: GridValueFormatterParams<Option>) => {
                    return params.value;
                },
                renderCell: function render({row}) {
                    if (isLoading) {
                        return "Loading...";
                    }

                    return row[key]
                },
            }
        )
    ) as GridColumns

    const allColumns = [
        ...fieldColumns,
        {
            field: "actions",
            headerName: "Actions",
            renderCell: function render({ row }) {
                return (
                    <>
                        <EditButton hideText recordItemId={row[rowIdColumn]} />
                        <ShowButton hideText recordItemId={row[rowIdColumn]} />
                        <DeleteButton hideText recordItemId={row[rowIdColumn]} />
                    </>
                );
            },
            align: "center",
            flex: 1,
            headerAlign: "center",
            minWidth: 80,
        } as GridEnrichedColDef,
    ]

    return (
        <List>
            <DataGrid {...dataGridProps} columns={allColumns} autoHeight getRowId={(row) => row[rowIdColumn]}/>
        </List>
    );
};