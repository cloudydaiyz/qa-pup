import { PupService } from "@cloudydaiyz/qa-pup-core";
import assert from "assert";

const pupService = new PupService();

type ScheduledTask = {
    task: "run" | "cleanup"
}

export const handler = async (event: ScheduledTask) => {
    await pupService.connection;

    if(event.task == "run") {
        await pupService.triggerRun("SCHEDULED");
    } else if(event.task == "cleanup") {
        await pupService.testLifecycleCleanup();
    } else {
        assert(false, "Invalid task");
    }

    return { statusCode: 200 };
}