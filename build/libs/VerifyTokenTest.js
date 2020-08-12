"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.TokenValidationTest = (req, res, next) => {
    const token = req.header('practice');
    console.log("Token: " + token);
    if (token == null) {
        console.log("no definido");
        return res.status(401).json('Acceso denegado');
    }
    else {
        var practice;
        try {
            practice = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SESION_PLAT || 'tokentest');
            req.practicaId = practice.id;
            console.log("Practica:" + practice);
            next();
        }
        catch (e) {
            console.log("errortoken");
            return res.status(401).json('Acceso denegado');
        }
    }
};
//# sourceMappingURL=VerifyTokenTest.js.map