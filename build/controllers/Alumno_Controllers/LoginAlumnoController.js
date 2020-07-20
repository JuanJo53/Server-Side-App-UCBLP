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
                const token = tokenService.getToken(req.body.correoDocente, "alumno");
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
    validarAlumno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Guardamos el correo y la contraseña en variables
            const tokenService = new tokenService_1.TokenService();
            console.log(req.headers);
            const correoEstudiante = req.body.correoEstudiante;
            const contraseniaEstudiante = req.body.contraseniaEstudiante;
            console.log("Correo: " + correoEstudiante);
            console.log("Contra: " + contraseniaEstudiante);
            const query = `SELECT  id_alumno, correo_alumno,contrasenia_alumno FROM alumno WHERE  estado_alumno= true 
                      AND correo_alumno = ?`;
            yield Database_1.default.query(query, [correoEstudiante], function (err, result, fields) {
                if (err)
                    throw err;
                //Si el resultado retorna un docente con esos datos se valida el ingreso
                if (result.length > 0) {
                    if (tokenService.valPass(contraseniaEstudiante, result[0].contrasenia_alumno)) {
                        const token = tokenService.getToken(result[0].id_alumno, "alumno");
                        console.log("Token: " + token);
                        res.json({
                            token: token
                        });
                        console.log("Entra");
                    }
                    else {
                        res.json({ text: "Usuario no validado" });
                        console.log("No entra por contrasenia");
                    }
                }
                else {
                    res.json({ text: "Usuario no validado" });
                    console.log("No entra por correo");
                }
            });
        });
    }
}
exports.loginAlumnoController = new LoginAlumnoController();
//# sourceMappingURL=LoginAlumnoController.js.map