import {
    HttpError,
    LiveModeProps, SuccessErrorNotification,
    useHandleNotification, useTranslate
} from "@pankod/refine-core";
import {MetaDataQuery} from "@pankod/refine-core";
import {IJinjatContextProvider, JinjatProject} from "components/hooks/schema";
import {useEffect, useState} from "react";


export type UseProjectSchemaProps = {
    schemaContext: IJinjatContextProvider
    /**
     *  Metadata query for `dataProvider`
     */
    metaData?: MetaDataQuery;
} & SuccessErrorNotification &
    LiveModeProps;

export interface JinjatProjectResponse {
    data?: JinjatProject,
    error?: HttpError,
    isLoading?: boolean
}


export const useJinjatProject = ({
                             schemaContext,
                             successNotification,
                             errorNotification,
                             metaData,
                         }: UseProjectSchemaProps): JinjatProjectResponse => {
    const translate = useTranslate();

    const handleNotification = useHandleNotification();

    const [data, setData] = useState<JinjatProject>()
    const [error, setError] = useState<HttpError>();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        schemaContext.getProject(metaData)
            .then(data => {
                setData(data);

                const notificationConfig =
                    typeof successNotification === "function"
                        ? successNotification(
                            data,
                            {metaData},
                        )
                        : successNotification;

                handleNotification(notificationConfig);
            })
            .catch(err => {
                setError(err);

                const notificationConfig =
                    typeof errorNotification === "function"
                        ? errorNotification(err, {metaData})
                        : errorNotification;

                handleNotification(notificationConfig, {
                    key: `useMenus-notification`,
                    message: translate(
                        "notifications.error",
                        {statusCode: err.statusCode},
                        `Error (status code: ${err.statusCode})`,
                    ),
                    description: err.message,
                    type: "error",
                });
            }).finally(() => setLoading(false))
    }, []);

    return {data, error, isLoading};
};
