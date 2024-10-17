import { Dispatch } from "react";
import Image from "next/image";
import OrganizationCombobox from "./OrganizationCombobox";
import { ScrollArea } from "./ui/scroll-area";
import TagMultiSelectCombobox from "./TagMultiSelectCombobox";
import GroupMultiSelectCombobox from "./GroupMultiSelectCombobox";
import { State } from "./App";

interface SidebarProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

const Sidebar: React.FC<SidebarProps> = ({ state, dispatch }) => {
    return (
        <div className="flex h-full flex-col items-center justify-start p-6">
            <div className="flex items-center mb-4">
                <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/c/ca/Seal_of_the_State_of_Hawaii.svg"
                    alt="Seal of the State of Hawaii"
                    width={75}
                    height={75} />
                <div className="ml-4">
                    <p className="text-lg font-bold">Hawaii Open Data</p>
                    <p className="text-sm text-gray-700">Government that is</p>
                    <p className="text-sm text-gray-700"><b>open</b> and <b>transparent</b></p>
                </div>
            </div>
            <ScrollArea>
                <OrganizationCombobox state={state} dispatch={dispatch} />
                <GroupMultiSelectCombobox state={state} dispatch={dispatch} />
                <TagMultiSelectCombobox state={state} dispatch={dispatch} />
            </ScrollArea>
        </div>
    );
};

export default Sidebar;
