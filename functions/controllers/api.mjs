"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const qa_pup_core_1 = require("@cloudydaiyz/qa-pup-core");
const path_parser_1 = require("path-parser");
const mongodb_1 = require("mongodb");
const assert_1 = __importDefault(require("assert"));
(0, assert_1.default)(process.env.MONGO_URI && process.env.MONGO_USER && process.env.MONGO_PASS, "MongoDB environment variables not set");
const pupCore = new qa_pup_core_1.PupCore(process.env.MONGO_URI, process.env.MONGO_USER, process.env.MONGO_PASS);
const dashboardPath = new path_parser_1.Path("/:stage/dashboard");
const latestTestPath = new path_parser_1.Path("/:stage/latest-test/:runId/:name");
const manualRunPath = new path_parser_1.Path("/:stage/manual-run");
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    yield pupCore.connection;
    const path = event.requestContext.path;
    const method = event.requestContext.httpMethod;
    let body = JSON.stringify({ message: "Operation successful" });
    try {
        const parsedDashboardPath = dashboardPath.test(path);
        const parsedLatestTestPath = latestTestPath.test(path);
        const parsedManualRunPath = manualRunPath.test(path);
        if (parsedDashboardPath && method == "GET") {
            const dashboard = yield pupCore.readDashboardInfo();
            body = JSON.stringify(dashboard);
        }
        else if (parsedLatestTestPath && method == "GET") {
            const testInfo = yield pupCore.readLatestTestInfo(new mongodb_1.ObjectId(parsedLatestTestPath.runId), parsedLatestTestPath.name);
            body = JSON.stringify(testInfo);
        }
        else if (parsedManualRunPath && method == "POST") {
            (0, assert_1.default)(event.body, "No email provided in the request body");
            const email = JSON.parse(event.body).email;
            yield pupCore.triggerRun("MANUAL", email);
        }
        else {
            body = JSON.stringify({ message: "Resource not found" });
            return { statusCode: 404, body };
        }
    }
    catch (e) {
        body = JSON.stringify({ message: e.message });
        return { statusCode: 400, body };
    }
    return { statusCode: 200, body };
});
exports.handler = handler;
