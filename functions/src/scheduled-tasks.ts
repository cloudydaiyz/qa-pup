import { PupService } from "@cloudydaiyz/qa-pup-core";
import assert from "assert";

const pupService = new PupService();

type ScheduledTask = {
    task: "run" | "cleanup"
}

export const handler = async (event: ScheduledTask) => {
    await pupService.connection;

    let body = JSON.stringify({ message: "Operation successful" });
    try {
        if(event.task == "run") {
            await pupService.triggerRun("SCHEDULED");
        } else if(event.task == "cleanup") {
            await pupService.testLifecycleCleanup();
        } else {
            throw new Error("Invalid task");
        }
    } catch(e) {

        body = JSON.stringify({ message: (e as Error).message });
        return { statusCode: 400, body };
    }
    
    return { statusCode: 200 };
}