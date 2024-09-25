import { EventBridgeHandler } from "aws-lambda";
import { Task } from "@aws-sdk/client-ecs";
import { PupService } from "@cloudydaiyz/qa-pup-core";
import { getTestCompletionLock, isEcsTestRunComplete, setTestCompletionLock } from "@cloudydaiyz/qa-pup-core/cloud";
import { assert } from "console";
import { LambdaDefaultReturn } from "./types.js";

const pupService = new PupService();

const findRunId = (task: Task) => {
    for(const o of task.overrides!.containerOverrides!) {
        for(const e of o.environment!) {
            if(e.name == "RUN_ID") {
                return e.value as string;
            }
        }
    }
}

export const handler: EventBridgeHandler<"ECS Task State Change", Task, LambdaDefaultReturn> = async (event) => {
    let runId = findRunId(event.detail)!;
    assert(runId, "RUN_ID not found in task");
    
    if(await isEcsTestRunComplete(runId)) {
        console.log("Test run complete");

        try {
            const lock = await getTestCompletionLock();
            if(lock == "OFF") {
                await setTestCompletionLock("ON");
                await pupService.connection;
                await pupService.testCompletion(runId);
                await setTestCompletionLock("OFF");
            }
        } catch(e) {
            console.log(e);
            await setTestCompletionLock("OFF");
            return { statusCode: 400 };
        }
    } else {
        console.log("Test run incomplete");
    }
    return { statusCode: 200 };
}