"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("../Database"));
class LoginController {
    //Validar inicio de sesión 
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Database_1.default.query('SELECT * FROM docente', function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
    //Listar docentes 
    listarDocentes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Database_1.default.query('SELECT * FROM docente WHERE estado_docente = true', function (err, result, fields) {
                if (err)
                    throw err;
                res.json(result);
            });
        });
    }
}
exports.loginController = new LoginController();
//# sourceMappingURL=LoginController.js.map