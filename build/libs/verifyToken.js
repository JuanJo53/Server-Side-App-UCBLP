"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.TokenValidation = (req, res, next) => {
    const token = req.header('authorization');
    if (!token)
        return res.status(401).json('Acceso denegado');
    const payload = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SESION_PLAT || 'tokentest');
    req.docenteId = payload.id;
    console.log("ID doc:" + payload);
    next();
};
//# sourceMappingURL=VerifyToken.js.map