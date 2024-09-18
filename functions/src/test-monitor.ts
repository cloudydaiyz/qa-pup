import { EventBridgeHandler } from "aws-lambda";
import { Task } from "@aws-sdk/client-ecs";
import { isEcsTestRunComplete, PupService } from "@cloudydaiyz/qa-pup-core";
import { assert } from "console";

// for handler, use EventBridgeHandler<TDetailType extends string, TDetail, TResult> from @types/aws-lambda
    // the type is a Task https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_task_events.html

const pupService = new PupService();

const findRunId = (task: Task) => {
    for(const o of task.overrides!.containerOverrides!) {
        for(const e of o.environment!) {
            if(e.name == "RUN_ID") {
                return e.value;
            }
        }
    }
}

export const handler: EventBridgeHandler<"ECS Task State Change", Task, void> = async (event) => {
    let runId = findRunId(event.detail);
    assert(runId, "RUN_ID not found in task");
    
    if(await isEcsTestRunComplete(runId!)) {
        console.log("Test run complete");
        await pupService.testLifecycleCleanup();
    } else {
        console.log("Test run incomplete");
    }

}