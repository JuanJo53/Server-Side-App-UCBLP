"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class Docente {
    criptPass() {
        const salt = bcryptjs_1.default.genSaltSync(10);
        this.contrasenia_docente = bcryptjs_1.default.hashSync(this.contrasenia_docente, salt);
    }
    valPass(password) {
        const ver = bcryptjs_1.default.compareSync(password, this.contrasenia_docente);
        return ver;
    }
    getToken() {
        return jsonwebtoken_1.default.sign({ id: this.id_docente }, process.env.TOKEN_SESION_PLAT || "TOKEN_PRUEBA", { expiresIn: 60 * 60 * 24 });
    }
}
exports.Docente = Docente;
//# sourceMappingURL=Docente.js.map