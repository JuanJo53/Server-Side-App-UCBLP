"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase = __importStar(require("firebase-admin"));
const serviceAccount = __importStar(require("./path/to/account_admin.json"));
class ConFirebase {
    constructor() {
        this.params = {
            type: serviceAccount.type,
            projectId: serviceAccount.project_id,
            privateKeyId: serviceAccount.private_key_id,
            privateKey: serviceAccount.private_key,
            clientEmail: serviceAccount.client_email,
            clientId: serviceAccount.client_id,
            authUri: serviceAccount.auth_uri,
            tokenUri: serviceAccount.token_uri,
            authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
            clientC509CertUrl: serviceAccount.client_x509_cert_url
        };
    }
    iniciar() {
        try {
            firebase.initializeApp({
                credential: firebase.credential.cert(this.params),
            });
            return true;
        }
        catch (e) {
            return false;
        }
    }
}
exports.ConFirebase = ConFirebase;
//# sourceMappingURL=FIrebase.js.map