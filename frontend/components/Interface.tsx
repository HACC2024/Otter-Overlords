import { Dispatch } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { State } from "./App";
import TabSwitch from "./TabSwitch";
import DatasetsView from "./DatasetsView";
import { Separator } from "./ui/separator";

interface InterfaceProps {
    state: State;
    dispatch: Dispatch<{ type: string; payload: unknown }>;
}

const Interface: React.FC<InterfaceProps> = ({ state, dispatch }) => {

    return (
        <div id="demotest" className="flex h-full w-full flex-col items-center justify-start p-6">
            <div className="flex items-center mb-5">
                <TabSwitch state={state} dispatch={dispatch} />
            </div>

            <ScrollArea className="w-full">
                <DatasetsView state={state} dispatch={dispatch} />
            </ScrollArea>
        </div>

    );
};

export default Interface;
