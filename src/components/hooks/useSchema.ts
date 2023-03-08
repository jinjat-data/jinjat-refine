import {
    QueryKey,
    QueryObserverResult,
    useQuery,
    UseQueryOptions,
} from "@tanstack/react-query";
import {
    BaseRecord,
    HttpError,
    LiveModeProps,
    SuccessErrorNotification,
    useCheckError, useHandleNotification,
    useResource, useResourceSubscription, useTranslate
} from "@pankod/refine-core";
import {useSchemaProvider} from "components/hooks/useSchemaProvider";
import {MetaDataQuery} from "@pankod/refine-core";
import {JsonSchema} from "@jsonforms/core";


export enum Type {
    REQUEST, RESPONSE
}

export interface UseSchemaConfig {
    type : Type
}


export type UseSchemaProps<TData, TError> = {
    /**
     * Resource name for API data interactions
     */
    resource: string;
    /**
     * Configuration for pagination, sorting and filtering
     * @type [`UseListConfig`](/docs/api-reference/core/hooks/data/useList/#config-parameters)
     */
    config?: UseSchemaConfig;
    /**
     * react-query's [useQuery](https://tanstack.com/query/v4/docs/reference/useQuery) options,
     */
    queryOptions?: UseQueryOptions<JsonSchema, TError>;
    /**
     *  Metadata query for `dataProvider`
     */
    metaData?: MetaDataQuery;
} & SuccessErrorNotification &
    LiveModeProps;


export const useSchema = <TData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    >({
          resource,
          config,
          queryOptions,
          successNotification,
          errorNotification,
          metaData,
      }: UseSchemaProps<TData, TError>): QueryObserverResult<JsonSchema,
    TError> => {
    const schemaProvider = useSchemaProvider();
    const translate = useTranslate();

    const {mutate: checkError} = useCheckError();
    const handleNotification = useHandleNotification();

    useResourceSubscription({
        resource,
        types: ["*"],
        channel: `resources/${resource}`,
    });

    const queryResponse = useQuery<JsonSchema, TError>(
        [{ ...config, ...metaData }] as QueryKey,
        ({queryKey, pageParam, signal}) => {
            let reqMetadata = {
                ...metaData,
                queryContext: {
                    queryKey,
                    pageParam,
                    signal,
                },
            };
            if (config?.type == Type.REQUEST) {
                return schemaProvider.getRequestSchema({
                    resource, metaData: reqMetadata,
                })
            } else if(config?.type == Type.RESPONSE) {
                return schemaProvider.getResponseSchema({
                    resource, metaData: reqMetadata,
                })
            }  else {
                throw Error(`Invalid useSchema type? ${config?.type}`)
            }
        },
        {
            ...queryOptions,
            onSuccess: (data) => {
                queryOptions?.onSuccess?.(data);

                const notificationConfig =
                    typeof successNotification === "function"
                        ? successNotification(
                            data,
                            {metaData, config},
                            resource,
                        )
                        : successNotification;

                handleNotification(notificationConfig);
            },
            onError: (err: TError) => {
                checkError(err);
                queryOptions?.onError?.(err);

                const notificationConfig =
                    typeof errorNotification === "function"
                        ? errorNotification(err, {metaData, config}, resource)
                        : errorNotification;

                handleNotification(notificationConfig, {
                    key: `${resource}-useSchema-notification`,
                    message: translate(
                        "notifications.error",
                        {statusCode: err.statusCode},
                        `Error (status code: ${err.statusCode})`,
                    ),
                    description: err.message,
                    type: "error",
                });
            },
        },
    );

    return queryResponse;
};
