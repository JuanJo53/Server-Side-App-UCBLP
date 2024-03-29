"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.TokenValidation = (req, res, next) => {
    const token = req.header('authorization');
    console.log("Token: " + token);
    if (token == null) {
        console.log("no definido");
        return res.status(401).json('Acceso denegado');
    }
    else {
        try {
            const payload = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SESION_PLAT || 'tokentest');
            if (payload.tipo == "docente") {
                req.docenteId = payload.id;
                console.log("ID doc:" + payload);
            }
            else {
                return res.status(401).json('Acceso denegado');
            }
            next();
        }
        catch (e) {
            console.log("errortoken");
            return res.status(401).json('Acceso denegado');
        }
    }
};
//# sourceMappingURL=VerifyToken.js.map