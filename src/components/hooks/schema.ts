import {AxiosInstance} from "axios";
import {axiosInstance} from "../../data-provider/utils";
import {stringify} from "query-string";
import {MetaDataQuery} from "@pankod/refine-core";
import {JsonSchema} from "@jsonforms/core";

enum FieldType {
    Boolean, Number, TimeDelta, Date, DateTime, Text
}

interface RefineResource {
    list: string;
    create: string;
    edit: string;
    show: string;

    [key: string]: any;
}

interface RefineAction {
    delete: string;

    [key: string]: any;
}

export interface RefineConfig {
    menu_icon?: string,
    actions?: RefineAction,
    resources?: RefineResource,
}

export interface Owner {
    email: string,
    name: string
}

export enum ResourceType {
    APPLICATION = "application", ANALYSIS = "analysis", DASHBOARD = "dashboard"
}

export interface JinjatResource {
    name: string,
    type: ResourceType,

    label?: string,
    description?: string

    package_name: string

    tags?: string

    refine: RefineConfig

    owner?: Owner
}

export interface JinjatProject {
    resources: JinjatResource[],
    version: string
}

export interface IJinjatContextProvider {
    getResponseSchema: (params: {
        resource: string;
        metaData?: MetaDataQuery;
    }) => Promise<JsonSchema>;

    getRequestSchema: (params: {
        resource: string;
        metaData?: MetaDataQuery;
    }) => Promise<JsonSchema>;

    getProject: (
        metaData?: MetaDataQuery
    ) => Promise<JinjatProject>

    getApiUrl: () => string
}

const REQUEST_QUERY = (analysis: string) => `paths.*.*[] | [?ends_with(operationId, \`${analysis}\`)] | [0] | requestBody.content."application/json".schema`
const RESPONSE_QUERY = (analysis: string) => `paths.*.*[] | [?ends_with(operationId, \`${analysis}\`)] | [0] | responses."200".content."application/json".schema`
const EXPOSURES_QUERY = 'exposures.* | [?not_null(meta.jinjat.refine)].projection(`name, type, description, package_name, refine, owner, label`, name, type, description, package_name, meta.jinjat.refine, owner, label)'
export const jinjatProvider = (
    apiUrl: string,
    httpClient: AxiosInstance = axiosInstance,
):
    IJinjatContextProvider => ({

    getProject(metaData: MetaDataQuery | undefined): Promise<JinjatProject> {
        let queryParams = stringify({jmespath: EXPOSURES_QUERY})
        return httpClient.get(
            `${apiUrl}/manifest.json?${queryParams}`,
        ).then(result => {
            return {resources: result.data, version: result.headers['x-dbt-project-version']}
        });
    },

    getApiUrl(): string {
        return apiUrl;
    },

    getResponseSchema: async ({resource}) => {
        let jmespath = stringify({jmespath: RESPONSE_QUERY(resource)});
        return httpClient.get(
            `${apiUrl}/0.1/openapi.json?${jmespath}`,
        ).then(result => result.data);
    },

    getRequestSchema: async ({resource}) => {
        let jmespath = stringify({jmespath: REQUEST_QUERY(resource)});
        return httpClient.get(
            `${apiUrl}/0.1/openapi.json?${jmespath}`,
        ).then(result => result.data);
    }
})