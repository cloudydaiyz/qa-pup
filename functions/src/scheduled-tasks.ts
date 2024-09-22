import { PupService } from "@cloudydaiyz/qa-pup-core";
import { LambdaDefaultReturn } from "./types.js";

const pupService = new PupService();

type ScheduledTask = {
    cron: string;
    task: "run" | "cleanup";
}

export const handler = async (event: ScheduledTask): Promise<LambdaDefaultReturn> => {
    await pupService.connection;

    try {
        if(event.task == "run") {
            await pupService.triggerRun("SCHEDULED", undefined, event.cron);
        } else if(event.task == "cleanup") {
            await pupService.testLifecycleCleanup(event.cron);
        } else {
            throw new Error("Invalid task");
        }
    } catch(e) {

        console.log(e);
        return { statusCode: 400 };
    }
    
    return { statusCode: 200 };
}