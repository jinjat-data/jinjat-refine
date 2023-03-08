import {Authenticated, IResourceComponentsProps, ResourceProps} from "@pankod/refine-core";
import {JinjatProject, JinjatResource, ResourceType} from "../components/hooks/schema";
import {JinjatList} from "../components/crud/list";
import {JinjatCreate} from "../components/crud/create";
import {JinjatEdit} from "../components/crud/edit";
import {JinjatShow} from "../components/crud/show";
import {Analysis} from "../components/Analysis";
import {Dashboard} from "../components/Dashboard";
import React, {FC} from "react";
import {Box} from "@pankod/refine-mui";

export function createResources({version, resources}: JinjatProject): ResourceProps[] {

    return (resources || []).map(resource => {

        let list: FC<IResourceComponentsProps>
        if (resource.type === ResourceType.APPLICATION) {
            list = JinjatList
        } else if (resource.type === ResourceType.ANALYSIS) {
            list = Analysis
        } else if (resource.type === ResourceType.DASHBOARD) {
            list = Dashboard
        } else {
            list = () => {
                return (
                    <Authenticated>
                        <Box component="nav">Unknown exposure type</Box>
                    </Authenticated>
                );
            };
        }

        return {
            name: `${version}/${resource.package_name}/${resource.name}`,
            list: list,
            edit: resource.type == ResourceType.APPLICATION ? JinjatEdit : undefined,
            show: resource.type == ResourceType.APPLICATION ? JinjatShow : undefined,
            create: resource?.refine?.resources?.create != null ? JinjatCreate : undefined,
            canDelete: resource.refine.actions?.delete != null,
            options: {
                label: resource.label || resource.name, route: `${resource.package_name}/${resource.name}`, jinjat: resource.refine
            }
        };
    })
}