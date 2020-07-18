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
    getToken(login_id) {
        return jsonwebtoken_1.default.sign({ id: login_id }, process.env.TOKEN_SESION_PLAT || "TOKEN_PRUEBA", { expiresIn: 60 * 60 * 24 });
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=tokenService.js.map