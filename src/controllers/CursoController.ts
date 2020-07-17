import { Request, Response } from 'express';
import Db from '../Database';
import util from 'util'

class CursoController {
    async sacarCantidadAlumnos(id_curso:number){
        const alumnosq=`select count(curso_alumno.id_alumno) as est
        FROM curso
        inner join curso_alumno on 
        curso.id_curso=curso_alumno.id_curso 
        inner join alumno 
        on curso_alumno.id_alumno = alumno.id_alumno
        WHERE
        curso.id_curso=?`
        try{            
            const result2:(arg1:string,arg2?:any[])=>Promise<unknown> = util.promisify(Db.query).bind(Db);
            var row =await result2(alumnosq,[id_curso]);
            return row;
        }
        catch(e){
            console.log(e);
            return false;
        }
    }
    public async obtenerCursosDocente(req: Request, res: Response) {
        const id = req.docenteId;
        console.log("ID: " + id);
        //Regresa la informacion basica de un curso
        const query = `select curso.id_curso  ,curso.nombre_curso, semestre.id_semestre  
        from curso inner join semestre on 
        curso.id_semestre = semestre.id_semestre 
        inner join docente 
        on curso.id_docente=docente.id_docente 
        where curso.estado_curso=true 
        and docente.id_docente= ?
        group by curso.id_curso`;
        //Regresa la informacion de los dias y horarios del curso
        const query3 = `select dia_semana.dia_semana as 'diaSemana', curso_dia.hora_inicio as 'horaInicio', curso_dia.hora_conclusion as 'horaConclusion'
        from curso_dia inner join dia_semana on
        curso_dia.id_dia_semana= dia_semana.id_dia_semana
        inner join curso on 
        curso.id_curso = curso_dia.id_curso
        inner join docente on
        docente.id_docente = curso.id_docente
        where curso.id_curso=?`;
        //Arreglo que almacena los resultados de las consultas
        let resultData: any = [];
        await Db.query(query, [id], async function (err, result, fields) {
            if (err) {
                console.log(err);
                res.json({text: 'Error al obtener los semestres'}).status(500);
            }
            //retorna la informacion basica del curso agregando los dias y horarios de cada uno
            else{
                var c = 1;
            console.log(result);
            for await (let i of result) {
                var cant_est=await cursoController.sacarCantidadAlumnos(i.id_curso) as any;
                if(!cant_est){
                    res.json({text: 'Error al obtener los semestres'}).status(500);
                }
                else{
                    i.estudiantes=cant_est[0].est||0;
                    Db.query(query3, [i.id_curso], function (err2, result3, fields2) {
                        if (err2) throw err2;
                        i.dias = result3;
                        if (c == result.length) {
                            res.json(result);
                        }
                        c++;
    
                    });
                }
            }
            }
        });


    }
    public async obtenerSemestres(req: Request, res: Response) {
        const query = `SELECT sem.id_semestre, sem.semestre
        FROM semestre sem
        WHERE sem.estado_semestre =true;`;
        Db.query(query, function (err, result, fields) {
            if (err) {
                res.json({text: 'Error al obtener los semestres'}).status(500);
                console.log(err);
            }
            else{
                res.json(result).status(200);
            }
            
        });


    }
    public async obtenerNiveles(req: Request, res: Response) {
        const query = `SELECT niv.id_nivel, niv.nivel
        FROM nivel niv
        WHERE niv.estado_nivel =true;`;
        Db.query(query, function (err, result, fields) {
            if (err) {
                res.json({text: 'Error al obtener los niveles'}).status(500);
                console.log(err);
            }
            else{
                res.json(result).status(200);
            }
            
        });


    }
    public async obtenerCursosDocentePestania(req: Request, res: Response) {
        const {id} = req.params;
        const query = `SELECT cu.id_curso, cu.nombre_curso
        FROM curso cu
        JOIN docente do ON
        cu.id_docente = do.id_docente
        AND do.estado_docente =true
        AND cu.estado_curso = true
        AND do.id_docente = ?;`;
        Db.query(query, [id], function (err, result, fields) {
            if (err) {
                res.json({text: 'Error al obtener los cursos'}).status(500);
                throw err;
            }
            else{
                res.json(result).status(200);
            }
            
        });


    }
    public async agregarHorarioCurso(dias:any[],idCurso:number){
        console.log(dias);
        var valores=[];
        var query = `INSERT INTO curso_dia (id_dia_semana,id_curso,hora_inicio,hora_conclusion,estado_curso_dia,tx_id,tx_username,tx_host)
        VALUES (?,?,?,?,?,?,?,?)`;
        var prim=false;
        for(let dia of dias){ 
            if(!prim){
                prim=true;
            }
            else
            if(prim){
                query+=",\n(?,?,?,?,?,?,?,?)"           
            }
            valores.push(dia.dia);
            valores.push(idCurso);
            valores.push(dia.horaInicio);
            valores.push(dia.horaFin);
            valores.push(true);
            valores.push(1);
            valores.push('root');
            valores.push('192.168.0.10');
        }

       try{
            const result:(arg1:string,arg2?:any[])=>Promise<unknown> = util.promisify(Db.query).bind(Db);
            await result(query,valores) as any[];                
            return true;             
            }
        catch(e){  
            console.log(e);              
            return false;
        }
        

    }
    public async agregarCurso(req: Request, res: Response) {
        const id = req.docenteId;
        const nombreCurso = req.body.curso;
        const idSemestre = req.body.idSemestre;
        const idNivel = req.body.idNivel;
        const dias = req.body.dias;
        const query = `insert into curso (nombre_curso,estado_curso,id_docente,id_semestre,id_nivel,tx_id,tx_username,tx_host,tx_date) 
        values(?,true,?,?,?,1,'root','192.168.0.10',CURRENT_TIMESTAMP());`;
        Db.query(query, [nombreCurso, id, idSemestre, idNivel], async function (err, result, fields) {
            if (err){
                res.status(500).json({ text: 'Error al crear el curso '});
                console.log(err);
            }
            else {
                console.log("Last ID " + result.insertId);
            var crear=await cursoController.agregarHorarioCurso(dias,result.insertId)
                if(crear){
                    cursoController.agregarModulosPredeterminados(req, res, result.insertId);
                }
                else{
                    res.status(500).json({ text: 'Error al crear el curso '});    
                }
            }
        });
    }

    private async agregarModulosPredeterminados(req: Request, res: Response, idCurso: Number) {
        const query3 = `insert into modulo (nombre_modulo,rubrica,id_curso,id_color,estado_modulo,id_tipo_modulo,id_imagen,tx_id,tx_username,tx_host,tx_date) values 
        ('Assistance',5.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()),
        ('Theme Lessons',20.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()),
        ('Theme Practices',10.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()),
        ('Theme Test',20.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()),
        ('Assesments',45.00,?,1,true,1,1,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP());`;
        Db.query(query3, [idCurso, idCurso, idCurso, idCurso, idCurso], function (err, result, fields) {
            if (err) {
                res.status(500).json({ text: 'Error al crear módulos' });
                throw err;
            }
            else {
                res.status(200).json({ text: 'Curso creado con éxito' })
            }
        });
    }

}

export const cursoController = new CursoController();