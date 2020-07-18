"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.TokenValidationAlumno = (req, res, next) => {
    const token = req.header('authorization');
    console.log("Token: " + token);
    if (token == null) {
        console.log("no definido");
        return res.status(401).json('Acceso denegado');
    }
    else {
        const payload = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SESION_PLAT || 'tokentest');
        if (payload.tipo == "alumno") {
            req.docenteId = payload.id;
            console.log("ID doc:" + payload);
        }
        else {
            console.log("no definido");
            return res.status(401).json('Acceso denegado');
        }
        next();
    }
};
//# sourceMappingURL=VerifyTokenAlumno.js.map