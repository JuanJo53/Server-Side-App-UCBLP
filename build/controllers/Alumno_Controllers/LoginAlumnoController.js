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
const Database_1 = __importDefault(require("../../Database"));
const tokenService_1 = require("../../libs/tokenService");
class LoginAlumnoController {
    registrarAlumno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenService = new tokenService_1.TokenService();
            req.body.contraseniaDocente = tokenService.criptPass(req.body.contraseniaDocente);
            Database_1.default.query('INSERT INTO alumno set ?', [req.body], function (err, result, fields) {
                if (err)
                    throw err;
                const token = tokenService.getToken(req.body.correoDocente);
                res.json(token);
            });
        });
    }
    actucalizarContraseniaAlumno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenService = new tokenService_1.TokenService();
            const { id } = req.params;
            const query = 'UPDATE alumno SET contrasenia_alumno = ? WHERE id_alumno = ?';
            Database_1.default.query(query, [tokenService.criptPass(req.body.conraseniaAlumno), id], function (err, result, fields) {
                if (err) {
                    res.status(500).json({ text: 'Error' });
                    throw err;
                }
                else {
                    res.status(200).json({ text: 'Contrasenia actualizada' });
                }
            });
        });
    }
}
exports.loginAlumnoController = new LoginAlumnoController();
//# sourceMappingURL=LoginAlumnoController.js.map