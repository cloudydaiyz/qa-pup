import { ObjectId } from "mongodb";

// Logs out a new ObjectId to use in check_env.sh if RUN_ID is not set
console.log(new ObjectId().toHexString());