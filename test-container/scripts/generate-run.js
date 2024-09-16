"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
// Logs out a new ObjectId to use in check_env.sh if RUN_ID is not set
console.log(new mongodb_1.ObjectId().toHexString());
