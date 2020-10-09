"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
var ca = fs_1.default.readFileSync(__dirname + '/certs/server-ca.pem');
var cert = fs_1.default.readFileSync(__dirname + '/certs/client-cert.pem');
var key = fs_1.default.readFileSync(__dirname + '/certs/client-key.pem');
exports.default = {
    database: {
        host: '34.95.189.118',
        user: "admin_ucb_plat",
        password: "BaseDeDatosIdiomas-UCB",
        database: "plataforma_idiomas",
        ssl: {
            ca: ca,
            cert: cert,
            key: key
        }
    },
};
//# sourceMappingURL=Keys.js.map