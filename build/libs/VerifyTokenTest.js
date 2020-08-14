"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.TokenValidationTest = (req, res, next) => {
    console.log(req.headers);
    const token = req.header('token_prac');
    console.log("Token: " + token);
    if (token == null) {
        console.log("no definido");
        return res.status(500).json('Acceso denegado');
    }
    else {
        var practice;
        try {
            practice = jsonwebtoken_1.default.verify(token, process.env.TOKEN_PRACTICA || 'tokentest');
            req.practicaId = practice.id;
            const tiempo = (practice.exp - Math.round(Date.now() / 1000)) - 60;
            const minutos = Math.floor(tiempo / 60);
            const segundos = tiempo - minutos * 60;
            const tiempoRes = { minutos: minutos, segundos: segundos };
            console.log(tiempoRes);
            req.tiempoPractica = tiempoRes;
            next();
        }
        catch (e) {
            console.log(e);
            console.log("errortoken");
            return res.status(500).json('Acceso denegado');
        }
    }
};
//# sourceMappingURL=VerifyTokenTest.js.map