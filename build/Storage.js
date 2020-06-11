"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports the Google Cloud client library
const db = __importStar(require("@google-cloud/storage"));
const serviceAccount = __importStar(require("./path/to/cloud_storage.json"));
// Creates a client
// Creates a client from a Google service account key.
const storage = new db.Storage({ keyFile: "./path/to/account_admin.json", credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key
    }, projectId: "grand-citadel-275922" });
exports.default = storage;
/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
//# sourceMappingURL=Storage.js.map