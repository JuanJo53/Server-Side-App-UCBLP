"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class TokenService {
    criptPass(password) {
        const salt = bcryptjs_1.default.genSaltSync(10);
        return bcryptjs_1.default.hashSync(password, salt);
    }
    valPass(password, passwordBd) {
        const ver = bcryptjs_1.default.compareSync(password, passwordBd);
        return ver;
    }
    getToken(login_id, tipo) {
        console.log(process.env.TOKEN_SESION_PLAT);
        return jsonwebtoken_1.default.sign({ id: login_id, tipo: tipo }, process.env.TOKEN_SESION_PLAT || "TOKEN_PRUEBA", { expiresIn: 60 * 60 * 24 });
    }
    getTokenPracticeTiempo(idPractica, expiracion) {
        return jsonwebtoken_1.default.sign({ id: idPractica }, process.env.TOKEN_PRACTICA || "TOKEN_PRUEBA", { expiresIn: expiracion });
    }
    getTokenPractice(idPractica) {
        return jsonwebtoken_1.default.sign({ id: idPractica }, process.env.TOKEN_PRACTICA || "TOKEN_PRUEBA");
    }
    revisarTokenPractica(token) {
        console.log("Token: " + token);
        if (token == null) {
            console.log("no definido");
            return false;
        }
        else {
            var practice;
            try {
                practice = jsonwebtoken_1.default.verify(token, process.env.TOKEN_PRACTICA || 'tokentest');
                console.log(practice);
                console.log(Date.now());
                console.log(practice);
                const tiempo = (practice.exp - Math.round(Date.now() / 1000)) - 60;
                const minutos = Math.floor(tiempo / 60);
                const segundos = tiempo - minutos * 60;
                const tiempoRes = { minutos: minutos, segundos: segundos };
                console.log(tiempoRes);
                return tiempoRes;
            }
            catch (e) {
                console.log("errortoken");
                return false;
            }
        }
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=tokenService.js.map