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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("../../Database"));
const firebase = __importStar(require("firebase-admin"));
const util_1 = __importDefault(require("util"));
const tokenService_1 = require("../../libs/tokenService");
const RecursoController_1 = require("../Docente_controllers/RecursoController");
class PracticaController {
    infoPractica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const idEstudiante = req.estudianteId;
            const nota = yield exports.practicaController.verificarDisponibilidad(Number(id), Number(idEstudiante));
            const query = `SELECT 
        practica.tiempo_limite,COUNT(practica_pregunta.id_pregunta_practica) as preguntas,practica.id_practica,practica.numero_practica,practica.nombre_practica,practica.inicio_fecha,inicio_hora,practica.fin_fecha,practica.fin_hora
        FROM practica_pregunta,practica INNER JOIN leccion ON
        leccion.id_leccion = practica.id_leccion
        INNER JOIN tema ON
        tema.id_tema=leccion.id_tema
        INNER JOIN curso ON
        curso.id_curso = tema.id_curso
        INNER JOIN curso_alumno ON
        curso_alumno.id_curso=curso.id_curso
        INNER JOIN alumno ON
        curso_alumno.id_alumno = alumno.id_alumno
        WHERE practica.id_practica=?
        AND practica.estado_practica=true
        AND leccion.estado_leccion = true
        AND tema.estado_tema = true
        AND curso.estado_curso = true
        AND curso_alumno.estado_curso_alumno = true
        AND alumno.id_alumno=?
        and practica.id_practica=practica_pregunta.id_practica`;
            Database_1.default.query(query, [id, idEstudiante], function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ text: 'No se pudo listar las practicas' });
                }
                else {
                    if (result[0].tiempo_limite != null) {
                        result[0].tiempo_limite -= 1;
                    }
                    ;
                    res.status(200).json({
                        info: result[0],
                        nota: nota
                    });
                }
            });
        });
    }
    listarPracticas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const idEstudiante = req.estudianteId;
            console.log(idEstudiante);
            console.log(id);
            const query = `SELECT practica.id_practica,practica.numero_practica,practica.nombre_practica,practica.inicio_fecha,inicio_hora,practica.fin_fecha,practica.fin_hora
        FROM practica INNER JOIN leccion ON
        leccion.id_leccion = practica.id_leccion
        INNER JOIN tema ON
        tema.id_tema=leccion.id_tema
        INNER JOIN curso ON
        curso.id_curso = tema.id_curso
        INNER JOIN curso_alumno ON
        curso_alumno.id_curso=curso.id_curso
        INNER JOIN alumno ON
        curso_alumno.id_alumno = alumno.id_alumno
        WHERE leccion.id_leccion=?
        AND practica.estado_practica=true
        AND leccion.estado_leccion = true
        AND tema.estado_tema = true
        AND curso.estado_curso = true
        AND curso_alumno.estado_curso_alumno = true
        AND alumno.id_alumno=?
        ORDER BY practica.inicio_fecha DESC`;
            Database_1.default.query(query, [id, idEstudiante], function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ text: 'No se pudo listar las practicas' });
                }
                else {
                    res.status(200).json(result);
                }
            });
        });
    }
    obtenerPracticaSQL(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idAlumno = req.estudianteId;
            const id = req.practicaId;
            const tiempo = req.tiempoPractica;
            const dispo = yield exports.practicaController.verificarDisponibilidad(Number(id), Number(idAlumno));
            console.log(dispo);
            if (dispo === "bien") {
                const query = `SELECT pregunta.id_habilidad,practica_pregunta.puntuacion_practica_pregunta,pregunta.id_tipo_pregunta,pregunta.id_tipo_respuesta
        ,practica_pregunta.id_pregunta_practica ,practica_pregunta.id_pregunta,pregunta.codigo_pregunta,
        practica_pregunta.puntuacion_practica_pregunta,pregunta.pregunta,pregunta.respuesta,pregunta.opciones,pregunta.recurso 
        FROM practica INNER JOIN practica_pregunta ON
        practica.id_practica = practica_pregunta.id_practica
        INNER JOIN pregunta ON
        pregunta.id_pregunta = practica_pregunta.id_pregunta
        WHERE practica_pregunta.estado_pregunta_practica   = true
        AND CAST(CONCAT(DATE(practica.inicio_fecha),' ',practica.inicio_hora-INTERVAL 4 HOUR) AS DATETIME)<=NOW()
        AND CAST(CONCAT(DATE(practica.fin_fecha),' ',practica.fin_hora-INTERVAL 4 HOUR) AS DATETIME)>=NOW()
        AND practica.id_practica=?`;
                try {
                    const result2 = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                    var row = yield result2(query, [id]);
                    if (row.length == 0) {
                        res.status(500).json({ text: 'No esta habilitado para ver esta practica' });
                    }
                    else {
                        console.log(row);
                        for (let preg of row) {
                            preg.opciones = JSON.parse(preg.opciones);
                            var tiempoRecurso = tiempo.minutos;
                            if (tiempoRecurso >= 10000) {
                                tiempoRecurso = 10000;
                            }
                            if (preg.id_habilidad == 1) {
                                var url = yield RecursoController_1.recursoController.getUrlViewResourcePractice(preg.recurso, tiempoRecurso);
                                console.log(url);
                                preg.recurso = url[0];
                            }
                            else if (preg.id_habilidad == 2) {
                                var url = yield RecursoController_1.recursoController.getUrlViewResourcePractice(preg.recurso, tiempoRecurso);
                                preg.recurso = url;
                            }
                            else {
                                preg.recurso = null;
                            }
                            switch (preg.id_tipo_respuesta) {
                                case 4:
                                    preg.respuesta = JSON.parse(preg.respuesta);
                                    preg.opciones.sort(exports.practicaController.funci);
                                    break;
                                case 5:
                                    preg.respuesta = JSON.parse(preg.respuesta);
                                    preg.opciones.sort(exports.practicaController.funci);
                                    preg.respuesta.sort(exports.practicaController.funci);
                                    break;
                                case 3:
                                    preg.respuesta = JSON.parse(preg.respuesta);
                                    for (let pregun of preg.respuesta) {
                                        pregun.cards = [];
                                    }
                                    preg.opciones.sort(exports.practicaController.funci);
                                    break;
                                default:
                                    preg.respuesta = [];
                                    break;
                            }
                        }
                        res.status(200).json({ preguntas: row, tiempo: tiempo });
                    }
                }
                catch (e) {
                    console.log(e);
                    res.status(500).json({ text: 'No se pudo listar la practica' });
                }
            }
            else {
                res.status(500).json({ text: 'No se pudo listar la practica' });
            }
        });
    }
    verificarDisponibilidad(idPractica, idAlumno) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(idPractica);
            console.log(idAlumno);
            const query = `
        SELECT nota_practica.practica_dada,nota_practica.nota_practica
        FROM nota_practica 
        WHERE nota_practica.id_practica=?
        AND nota_practica.id_alumno=?`;
            try {
                const result2 = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                var row = yield result2(query, [idPractica, idAlumno]);
                console.log(row);
                if (row.length == 0) {
                    return false;
                }
                else {
                    if (row[0].practica_dada) {
                        return row[0].nota_practica;
                    }
                    else {
                        return "bien";
                    }
                }
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    obtenerPractica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idAlumno = req.estudianteId;
            const id = req.practicaId;
            const tiempo = req.tiempoPractica;
            const query = `
            SELECT practica_pregunta.puntuacion_practica_pregunta,pregunta.id_tipo_pregunta,pregunta.id_tipo_respuesta,practica_pregunta.id_pregunta_practica ,practica_pregunta.id_pregunta,pregunta.codigo_pregunta,
            practica_pregunta.puntuacion_practica_pregunta 
            FROM practica INNER JOIN practica_pregunta ON
            practica.id_practica = practica_pregunta.id_practica
            INNER JOIN pregunta ON
            pregunta.id_pregunta = practica_pregunta.id_pregunta
            WHERE practica_pregunta.estado_pregunta_practica   = true
            AND CAST(CONCAT(DATE(practica.inicio_fecha),' ',practica.inicio_hora-INTERVAL 4 HOUR) AS DATETIME)<=NOW()
            AND CAST(CONCAT(DATE(practica.fin_fecha),' ',practica.fin_hora-INTERVAL 4 HOUR) AS DATETIME)>=NOW()
            AND practica.id_practica=?`;
            try {
                const result2 = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                var row = yield result2(query, [id]);
                if (row.length == 0) {
                    res.status(500).json({ text: 'No esta habilitado para ver esta practica' });
                }
                else {
                    var listaPreg = [];
                    for (let preg of row) {
                        listaPreg.push(preg.codigo_pregunta);
                    }
                    const db = firebase.firestore();
                    var datos = yield db.collection('Preguntas').where(firebase.firestore.FieldPath.documentId(), "in", listaPreg).get();
                    for (let preg in row) {
                        var docs = datos.docs;
                        for (let doc of docs) {
                            if (doc.id === row[preg].codigo_pregunta) {
                                var preguntaaux = doc.data();
                                preguntaaux.respuestas = [];
                                row[preg].pregunta = preguntaaux;
                                break;
                            }
                        }
                    }
                    // const tokenService=new TokenService();
                    // const token=tokenService.getTokenPractice(Number(id),30);
                    res.status(500).json({ text: 'No se pudo listar la practica' });
                }
            }
            catch (e) {
                console.log(e);
                res.status(500).json({ text: 'No se pudo listar la practica' });
            }
        });
    }
    obtenerTokenPractica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const idAlumno = req.estudianteId;
            const query = `SELECT ntp.token ,ntp.practica_dada,
        IF(UNIX_TIMESTAMP(CAST(CONCAT(DATE(practica.fin_fecha),' ',practica.fin_hora-INTERVAL 4 HOUR) AS DATETIME))-UNIX_TIMESTAMP(NOW()) >=practica.tiempo_limite*60,practica.tiempo_limite*60,(UNIX_TIMESTAMP(CAST(CONCAT(DATE(practica.fin_fecha),' ',practica.fin_hora-INTERVAL 4 HOUR) AS DATETIME))-UNIX_TIMESTAMP(NOW()))) as tiempo_limite
        FROM nota_practica ntp
        INNER JOIN practica ON
        practica.id_practica=ntp.id_practica
         INNER JOIN leccion ON
        leccion.id_leccion = practica.id_leccion
        INNER JOIN tema ON
        tema.id_tema=leccion.id_tema
        INNER JOIN curso ON
        curso.id_curso = tema.id_curso
        INNER JOIN curso_alumno ON
        curso_alumno.id_curso=curso.id_curso
        INNER JOIN alumno ON
        curso_alumno.id_alumno = alumno.id_alumno AND
        alumno.id_alumno=ntp.id_alumno
        WHERE practica.id_practica=?
        AND practica.estado_practica=true
        AND leccion.estado_leccion = true
        AND tema.estado_tema = true
        AND curso.estado_curso = true
        AND CAST(CONCAT(DATE(practica.inicio_fecha),' ',practica.inicio_hora-INTERVAL 4 HOUR) AS DATETIME)<=NOW()
        AND CAST(CONCAT(DATE(practica.fin_fecha),' ',practica.fin_hora-INTERVAL 4 HOUR) AS DATETIME)>=NOW()
        AND curso_alumno.estado_curso_alumno = true
        AND ntp.estado_nota_practica = true
        AND alumno.id_alumno=?`;
            const result2 = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
            try {
                var row = yield result2(query, [id, idAlumno]);
                var token = "";
                const tokenService = new tokenService_1.TokenService();
                if (!row[0].practica_dada) {
                    if (row[0].token == null) {
                        if (row[0].tiempo_limite != null) {
                            token = tokenService.getTokenPracticeTiempo(Number(id), row[0].tiempo_limite);
                        }
                        else {
                            token = tokenService.getTokenPractice(Number(id));
                        }
                        const insertarToken = "UPDATE nota_practica set token=? WHERE id_practica=? and id_alumno=?";
                        yield result2(insertarToken, [token, id, idAlumno]);
                        res.status(200).json(token);
                    }
                    else {
                        token = row[0].token;
                        if (tokenService.revisarTokenPractica(token)) {
                            res.status(200).json(token);
                        }
                        else {
                            res.status(500).json({ text: 'No esta habilitado para dar la practica' });
                        }
                    }
                }
                else {
                    res.status(500).json({ text: 'No esta habilitado para dar la practica' });
                }
            }
            catch (e) {
                console.log(e);
                res.status(500).json({ text: 'No esta habilitado para dar la practica' });
            }
        });
    }
    compararRespuestas(re, re2) {
        var ver = true;
        var re1 = JSON.parse(re.respuesta);
        var opc = JSON.parse(re.opciones);
        switch (re.id_tipo_respuesta) {
            case 3:
                if (re1.length != re2.respuesta.length) {
                    ver = false;
                }
                else {
                    var respuesta = [];
                    for (let rep of re1) {
                        var letra = [];
                        for (let card of rep.cards) {
                            letra.push(opc[card]);
                        }
                        respuesta.push(letra);
                    }
                    for (let i in respuesta) {
                        respuesta[i].sort();
                        re2.respuesta[i].sort();
                        if (re2.respuesta[i].length == respuesta[i].length) {
                            for (let j in respuesta[i]) {
                                if (respuesta[i][j] !== re2.respuesta[i][j]) {
                                    ver = false;
                                }
                            }
                        }
                        else {
                            ver = false;
                            break;
                        }
                    }
                }
                break;
            case 4:
                ver = true;
                var tamR = 0;
                for (let resp of re1) {
                    if (resp === "*") {
                        tamR++;
                    }
                }
                if (tamR <= opc.length && opc.length >= re2.respuesta.length) {
                    for (let i = 0; i < tamR; i++) {
                        if (opc[i] !== re2.respuesta[i]) {
                            ver = false;
                        }
                    }
                }
                break;
            case 5:
                if (re1.length != re2.respuesta.length || opc.length != re2.opciones.length) {
                    ver = false;
                }
                else {
                    console.log(re1);
                    console.log(opc);
                    console.log(re2.opciones);
                    console.log(re2.respuesta);
                    ver = true;
                    for (let i in re1) {
                        for (let j in opc) {
                            if (re2.respuesta[i] == re1[j] && re2.opciones[i] != opc[j]) {
                                ver = false;
                                break;
                            }
                        }
                    }
                }
                break;
            default:
                if (re1.length != re2.respuesta.length) {
                    ver = false;
                }
                else {
                    for (let i in re1) {
                        if (re1[i] != re2.respuesta[i]) {
                            ver = false;
                            break;
                        }
                    }
                }
                break;
        }
        return ver;
    }
    revisarPracticaSQL(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.practicaId;
            const idEstudiante = req.estudianteId;
            const preguntasR = req.body.preguntas;
            const query = `SELECT practica_pregunta.id_pregunta_practica,curso.id_curso,practica_pregunta.puntuacion_practica_pregunta,pregunta.id_tipo_pregunta,
        pregunta.id_tipo_respuesta,practica_pregunta.id_pregunta_practica ,practica_pregunta.id_pregunta,pregunta.codigo_pregunta,
        practica_pregunta.puntuacion_practica_pregunta,pregunta.pregunta,pregunta.respuesta,pregunta.opciones,pregunta.recurso 
        FROM practica INNER JOIN practica_pregunta ON
        practica.id_practica = practica_pregunta.id_practica
        INNER JOIN pregunta ON
        pregunta.id_pregunta = practica_pregunta.id_pregunta
        INNER JOIN leccion ON
        leccion.id_leccion = practica.id_leccion
        INNER JOIN tema ON
        tema.id_tema=leccion.id_tema
        INNER JOIN curso ON
        curso.id_curso = tema.id_curso
        INNER JOIN curso_alumno ON
        curso_alumno.id_curso=curso.id_curso
        INNER JOIN alumno ON
        curso_alumno.id_alumno = alumno.id_alumno
        WHERE practica.estado_practica=true
        AND leccion.estado_leccion = true
        AND tema.estado_tema = true
        AND curso.estado_curso = true
        AND curso_alumno.estado_curso_alumno = true
        AND practica_pregunta.estado_pregunta_practica   = true
        AND CAST(CONCAT(DATE(practica.inicio_fecha),' ',practica.inicio_hora-INTERVAL 4 HOUR) AS DATETIME)<=NOW()
        AND CAST(CONCAT(DATE(practica.fin_fecha),' ',practica.fin_hora-INTERVAL 4 HOUR) AS DATETIME)>=NOW()
        AND practica.id_practica=?
        AND alumno.id_alumno=?`;
            const agregarNota = `
            UPDATE nota_practica set nota_practica=?, practica_dada=true
            WHERE id_alumno=? AND id_practica=?`;
            const agregarRespuesta = `
        INSERT INTO pregunta_respuesta(id_alumno,id_pregunta_practica,respuesta,estado_pregunta_respuesta,tx_id,tx_username,tx_host,puntaje)
        VALUES ?`;
            const obtenerNotasPractica = `
        SELECT AVG(nota_practica.nota_practica) as promedio
        FROM nota_practica INNER JOIN practica ON
        practica.id_practica = nota_practica.id_practica
        INNER JOIN leccion ON
        leccion.id_leccion = practica.id_leccion
        INNER JOIN tema ON
        tema.id_tema=leccion.id_tema
        INNER JOIN curso ON
        curso.id_curso = tema.id_curso
        INNER JOIN curso_alumno ON
        curso_alumno.id_curso=curso.id_curso
        INNER JOIN alumno ON
        curso_alumno.id_alumno = alumno.id_alumno
        WHERE practica.estado_practica=true
        AND leccion.estado_leccion = true
        AND tema.estado_tema = true
        AND curso.estado_curso = true
        AND curso_alumno.estado_curso_alumno = true
        AND alumno.id_alumno=?`;
            const moduloPractica = `
        SELECT modulo.id_modulo 
        FROM modulo INNER JOIN curso ON
        curso.id_curso= modulo.id_curso
        WHERE curso.id_curso = ?
        AND curso.estado_curso = true
        AND modulo.nombre_modulo = 'Theme Practices'
        AND modulo.estado_modulo =true `;
            const agregarNotaModulo = `
            UPDATE nota_modulo set nota_modulo=?,estado_nota_modulo=true,tx_id=1,tx_username='root',tx_host='192.168.0.10',tx_date=CURRENT_TIMESTAMP()
            WHERE id_alumno=? AND id_modulo=?`;
            try {
                const result2 = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                var row = yield result2(query, [id, idEstudiante]);
                if (row.length == 0) {
                    res.status(500).json({ text: 'No esta habilitado para ver esta practica' });
                }
                else {
                    if (row.length != preguntasR.length) {
                        console.log(row);
                        console.log(preguntasR);
                        res.status(500).json({ text: 'Error en los datos Enviados' });
                    }
                    else {
                        var puntuacion = 0;
                        var respuestas = [];
                        for (let preg of row) {
                            for (let pregR of preguntasR) {
                                if (preg.id_pregunta === pregR.idPregunta) {
                                    if (exports.practicaController.compararRespuestas(preg, pregR)) {
                                        puntuacion += preg.puntuacion_practica_pregunta;
                                    }
                                    else {
                                        preg.puntuacion_practica_pregunta = 0;
                                    }
                                    respuestas.push([idEstudiante, preg.id_pregunta_practica, JSON.stringify(pregR.respuesta), true, 1, 'root', '192.168.0.10', preg.puntuacion_practica_pregunta]);
                                    break;
                                }
                            }
                        }
                        yield result2(agregarRespuesta, [respuestas]);
                        yield result2(agregarNota, [puntuacion, idEstudiante, id]);
                        var promedioPracticas = yield result2(obtenerNotasPractica, [idEstudiante]);
                        var idModulo = yield result2(moduloPractica, [row[0].id_curso]);
                        yield result2(agregarNotaModulo, [promedioPracticas[0].promedio, idEstudiante, idModulo[0].id_modulo]);
                        console.log(idModulo);
                        res.status(200).json({ nota: puntuacion });
                    }
                }
            }
            catch (e) {
                console.log(e);
                res.status(500).json({ text: 'No se pudo listar la practica' });
            }
        });
    }
    funci(a, b) {
        return 0.5 - Math.random();
    }
    revisarPractica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.body.id;
            const idEstudiante = req.estudianteId;
            const preguntasR = req.body.preguntas;
            const query = `SELECT pregunta.id_pregunta,curso.id_curso,practica_pregunta.puntuacion_practica_pregunta,pregunta.id_tipo_pregunta,pregunta.id_tipo_respuesta,practica_pregunta.id_pregunta_practica ,practica_pregunta.id_pregunta,pregunta.codigo_pregunta,
        practica_pregunta.puntuacion_practica_pregunta 
        FROM practica INNER JOIN practica_pregunta ON
        practica.id_practica = practica_pregunta.id_practica
        INNER JOIN pregunta ON
        pregunta.id_pregunta = practica_pregunta.id_pregunta
        INNER JOIN leccion ON
        leccion.id_leccion = practica.id_leccion
        INNER JOIN tema ON
        tema.id_tema=leccion.id_tema
        INNER JOIN curso ON
        curso.id_curso = tema.id_curso
        INNER JOIN curso_alumno ON
        curso_alumno.id_curso=curso.id_curso
        INNER JOIN alumno ON
        curso_alumno.id_alumno = alumno.id_alumno
        WHERE practica.estado_practica=true
        AND leccion.estado_leccion = true
        AND tema.estado_tema = true
        AND curso.estado_curso = true
        AND curso_alumno.estado_curso_alumno = true
        AND practica_pregunta.estado_pregunta_practica   = true
        AND CAST(CONCAT(DATE(practica.inicio_fecha),' ',practica.inicio_hora-INTERVAL 4 HOUR) AS DATETIME)<=NOW()
        AND CAST(CONCAT(DATE(practica.fin_fecha),' ',practica.fin_hora-INTERVAL 4 HOUR) AS DATETIME)>=NOW()
        AND practica.id_practica=?`;
            const agregarNota = `
            INSERT INTO nota_practica(id_practica,id_alumno,nota_practica,estado_nota_practica,tx_id,tx_username,tx_host,tx_date)
            VALUES (?,?,?,true,1,'root','192.168.0.10',CURRENT_TIMESTAMP())`;
            const obtenerNotasPractica = `
        SELECT AVG(nota_practica.nota_practica) as promedio
        FROM nota_practica INNER JOIN practica ON
        practica.id_practica = nota_practica.id_practica
        INNER JOIN leccion ON
        leccion.id_leccion = practica.id_leccion
        INNER JOIN tema ON
        tema.id_tema=leccion.id_tema
        INNER JOIN curso ON
        curso.id_curso = tema.id_curso
        INNER JOIN curso_alumno ON
        curso_alumno.id_curso=curso.id_curso
        INNER JOIN alumno ON
        curso_alumno.id_alumno = alumno.id_alumno
        WHERE practica.estado_practica=true
        AND leccion.estado_leccion = true
        AND tema.estado_tema = true
        AND curso.estado_curso = true
        AND curso_alumno.estado_curso_alumno = true
        AND alumno.id_alumno=?`;
            const moduloPractica = `
        SELECT modulo.id_modulo 
        FROM modulo INNER JOIN curso ON
        curso.id_curso= modulo.id_curso
        WHERE curso.id_curso = ?
        AND curso.estado_curso = true
        AND modulo.nombre_modulo = 'Theme Practices'
        AND modulo.estado_modulo =true `;
            const agregarNotaModulo = `
            UPDATE nota_modulo set nota_modulo=?,estado_nota_modulo=true,tx_id=1,tx_username='root',tx_host='192.168.0.10',tx_date=CURRENT_TIMESTAMP()
            WHERE id_alumno=? AND id_modulo=?`;
            try {
                const result2 = util_1.default.promisify(Database_1.default.query).bind(Database_1.default);
                var row = yield result2(query, [id]);
                if (row.length == 0) {
                    res.status(500).json({ text: 'No esta habilitado para ver esta practica' });
                }
                else {
                    console.log(row);
                    if (row.length != preguntasR.length) {
                        res.status(500).json({ text: 'Error en los datos Enviados' });
                    }
                    else {
                        var listaPreg = [];
                        for (let preg of row) {
                            listaPreg.push(preg.codigo_pregunta);
                        }
                        const db = firebase.firestore();
                        var datos = yield db.collection('Preguntas').where(firebase.firestore.FieldPath.documentId(), "in", listaPreg).get();
                        var puntuacion = 0;
                        for (let preg in preguntasR) {
                            var docs = datos.docs;
                            for (let doc of docs) {
                                if (doc.id === preguntasR[preg].codigoPregunta) {
                                    var preguntaaux = doc.data();
                                    if (exports.practicaController.compararRespuestas(preguntaaux.respuestas, preguntasR[preg].respuesta)) {
                                        puntuacion += row[preg].puntuacion_practica_pregunta;
                                    }
                                    break;
                                }
                            }
                            var preguntaaux = datos.docs[preg].data();
                        }
                        yield result2(agregarNota, [id, idEstudiante, puntuacion, id, idEstudiante,]);
                        var promedioPracticas = yield result2(obtenerNotasPractica, [idEstudiante]);
                        var idModulo = yield result2(moduloPractica, [row[0].id_curso]);
                        yield result2(agregarNotaModulo, [promedioPracticas[0].promedio, idEstudiante, idModulo[0].id_modulo]);
                        console.log(idModulo);
                        res.status(200).json("Se califico el examen correctamente");
                    }
                }
            }
            catch (e) {
                console.log(e);
                res.status(500).json({ text: 'No se pudo listar la practica' });
            }
        });
    }
}
exports.practicaController = new PracticaController();
//# sourceMappingURL=PracticaController.js.map