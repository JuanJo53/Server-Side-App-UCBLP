import { Request, Response, query } from 'express';
import Db from '../Database';
import util from 'util'

class ClassController {

    public async listaAlumnos(req: Request, res: Response) {
        const { id } = req.params;
        const query = `select curso_alumno.id_curso_alumno ,alumno.id_alumno, alumno.nombre_alumno, alumno.ap_paterno_alumno,alumno.ap_materno_alumno, sum(nota_modulo.nota_modulo*modulo.rubrica/100) as 'nota'
        from curso_alumno inner join alumno on 
        curso_alumno.id_alumno = alumno.id_alumno
        inner join nota_modulo on
        alumno.id_alumno=nota_modulo.id_alumno
        inner join modulo on 
        nota_modulo.id_modulo=modulo.id_modulo
        inner join curso on
        curso.id_curso=modulo.id_curso and 
        curso_alumno.id_curso=modulo.id_curso
        
        where curso_alumno.id_curso=?
        and curso.estado_curso = true 
        and alumno.estado_alumno=true
        and modulo.estado_modulo=1
        and nota_modulo.estado_nota_modulo=true
        and curso_alumno.estado_curso_alumno=true
        group by curso_alumno.id_alumno , curso_alumno.id_curso_alumno
        order by alumno.ap_paterno_alumno;`;
        await Db.query(query, [id], function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    }
    public async bajaAlumnoCurso(req: Request, res: Response) {
        const { id } = req.params;
        const query = `UPDATE curso_alumno SET estado_curso_alumno = false WHERE id_curso_alumno= ?`
        Db.query(query, [id], function (err, result, fields) {
            if (err) {
                res.json({ text: 'Error en la eliminación' }).status(403);
                throw err;
            }
            else {
                res.json({ text: 'El alumno ha sido eliminado con éxito' }).status(200);
            }
        });
    }

    public async obtenerAlumnoAltaCurso(req: Request, res: Response) {
        const correoAlumno = req.body.correoAlumno;
        const query = `SELECT id_alumno,nombre_alumno,ap_paterno_alumno,ap_materno_alumno FROM alumno WHERE correo_alumno = ? AND estado_alumno = true`;
        Db.query(query, [correoAlumno], function (err, result, fields) {
            if (err) {
                res.status(403).json({ text: 'Error' });
                throw err;
            }
            else {
                if (result.length > 0) {
                    res.status(200).json(result);
                }
                else {
                    res.statusMessage = "student not found";
                    res.status(210).json({ text: 'Alumno no encontrado' });
                }

            }
        });
    }
    public async insertarNotasAlumno(idAlumno:number,idCurso:number){
      try{
        const query =`insert into nota_modulo (id_modulo,id_alumno,nota_modulo,estado_nota_modulo,tx_id,tx_username,tx_host,tx_date)
        SELECT modulo.id_modulo,?,0,true,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP()
        FROM modulo 
        WHERE modulo.id_curso=?
        AND modulo.estado_modulo=1`;
        const result:(arg1:string,arg2?:any[])=>Promise<unknown> = util.promisify(Db.query).bind(Db);
        await result(query,[idAlumno,idCurso]) as any[]; 
        return true;
    }
      catch(e){
          console.log(e);
          return false;
      }
    }
    public async altaAlumnoCurso(req: Request, res: Response) {
        const idAlumno = req.body.idAlumno;
        const idCurso = req.body.idCurso;
        console.log(idAlumno);
        console.log(idCurso);
        const queryver = `SELECT id_curso_alumno from curso_alumno where curso_alumno.id_curso=? and curso_alumno.id_alumno=? and curso_alumno.estado_curso_alumno=true`;
        Db.query(queryver, [idCurso, idAlumno], function (err, result0, fields) {
            if (err) {
                if (err) {
                    res.status(403).json({ text: err });
                }

            }
            else {
                if (result0.length > 0) {
                    res.statusMessage = "found";
                    res.status(212).json({ text: 'Ya esta inscrito el estudiante' });
                }
                else {
                    const query = `INSERT INTO curso_alumno (id_alumno,id_curso,estado_curso_alumno,tx_id,tx_username,tx_host,tx_date)
                      VALUES (?,?,true,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP())`;
                    Db.query(query, [idAlumno, idCurso], function (err, result, fields) {
                        if (err) {
                            res.statusMessage = "sql err";
                            res.status(211).json({ text: 'No se pudo agregar al estudiante' });
                            throw err;
                        }
                        else {
                            const query2 = `SELECT id_curso_alumno  from curso_alumno where curso_alumno.id_curso=? and curso_alumno.id_alumno=?  and curso_alumno.estado_curso_alumno=true`;
                            Db.query(query2, [idCurso, idAlumno], async function (err, result2, fields) {
                                if (err) {
                                    res.status(403).json({ text: 'Error' });
                                }
                                else {
                                    var resultNotaAlumno=await classController.insertarNotasAlumno(idAlumno,idCurso);
                                    if(resultNotaAlumno)
                                    res.status(200).json(result2);
                                    else
                                    res.status(500).json({ text: 'No se pudo agregar al estudiante' });

                                }
                            });
                        }
                    });
                }
            }
        });
    }
    public async crearAsistencia(req: Request, res: Response){
        const id = req.body.idCurso;
        const query = `SELECT fecha_clase
                        FROM clase WHERE clase.id_Curso=? AND fecha_clase=CURRENT_DATE()`;
        Db.query(query, [id], function (e, r, f) {
            if(e){
                return res.status(500).json({text:'Error'});
            }
            else{
                if (r.length == 0) {
                    const query2 = `INSERT INTO clase 
                                (id_Curso,fecha_clase,estado_clase,tx_id,tx_username,tx_host,tx_date) 
                                VALUES(?,CURRENT_DATE(),true,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP());`;
                Db.query(query2, [id], function (e2, r2, f2) {
                    if(e2){
                        return res.status(500).json({text:e2});
                    }
                    else{
                        const query3 = `SELECT id_clase  
                                FROM clase where clase.fecha_clase=CURRENT_DATE() and clase.id_Curso=?`;
                                Db.query(query3, [id], function (e3, r3, f3) {
                                    if(e3){
                                        return res.status(500).json({text:'Error'});    
                                    }
                                    else{                                     
                                        return res.status(200).json({text:r3});
                                    }
                                })
                    }
                })
                }
                else{
                    return res.status(500).json({text:"La clase ya existe"});
                }
                
            }
        })
        
                    }
    public async insertarAsistencia(req: Request, res: Response) {
        const id = req.body.idCurso;
        const fecha=req.body.fecha;
        const q = `SELECT * FROM asistencia  INNER JOIN clase on
                asistencia.id_clase = clase.id_clase
                where id_curso = ? `;
        Db.query(q, [id], function (e, r, f) {
            if (e) {
                res.status(500).json({ text: 'Error' });
            }
            else {
                if (r.length > 0) {
                    res.status(200).json({ text: 'asistencias creadas' });
                }
                else {
                    const query = 'SELECT id_clase FROM clase WHERE id_curso = ? ';
                    Db.query(query, [id], function (err, result, fields) {
                        if (err) {
                            throw err;
                        }
                        else {
                            for (let i = 0; i < result.length; i++) {
                                const query = 'SELECT id_alumno FROM curso_alumno WHERE id_curso =? and estado_curso_alumno =true';
                                Db.query(query, [id], function (err1, result1, fields) {
                                    for (let j = 0; j < result1.length; j++) {
                                        const query3 = `INSERT INTO asistencia (id_clase,id_alumno,asistencia,estado_asistencia,tx_id,tx_username,tx_host,tx_date)
                            VALUES (?,?,false,true,1,'root',' 192.168.0.10',CURRENT_TIMESTAMP())`;
                                        Db.query(query3, [result[i].id_clase, result1[j].id_alumno], function (err2, result2, fields2) {
                                            if (err2) {
                                                res.status(500).json({ text: 'Error' });
                                                throw err2;
                                            }
                                            else {

                                            }
                                        })
                                    }
                                });
                            }
                        }
                    });
                }
            }

        });


    }
    public async listaAlumnosAsistencia2(req:Request,res:Response){
        const fecha=req.body.fechaClase;
        const id=req.body.id;
        const queryAl = `SELECT curso_alumno.id_alumno, alumno.nombre_alumno,alumno.ap_paterno_alumno,alumno.ap_materno_alumno 
        FROM curso_alumno INNER JOIN alumno ON curso_alumno.id_alumno=alumno.id_alumno WHERE id_curso =? and estado_curso_alumno =true`;
        Db.query(queryAl,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:err});
            }
            else{
                var c=1;
               for(let i in result){
                const query2=`SELECT asistencia.asistencia,DAY(clase.fecha_clase) as dia
                FROM  asistencia 
                INNER JOIN clase ON
                clase.id_clase=asistencia.id_clase
                INNER JOIN curso ON
                curso.id_curso = clase.id_curso
                WHERE MONTH(fecha_clase) =?                
                AND asistencia.id_alumno=?
                AND estado_asistencia = true
                AND curso.id_curso=?
                ORDER BY dia`
                Db.query(query2,[fecha,result[i].id_alumno,id],function(err2,result2,fields2){
                    if(err2){
                        res.status(500).json({text:err2});
                        return false;
                    }
                    else{
                        result[i].asistencia=result2;
                        if(c==result.length){
                            res.status(200).json(result);
                            return true;                          
                        }
                    }
                    c++;
                }) ;
                   
               }

            }
        })                        
        
    }
    public async listaAlumnosAsistencia(req:Request,res:Response){
        const fecha=req.body.fechaClase;
        const id=req.body.id;
        const query=`SELECT asistencia.id_clase_alumno ,alumno.nombre_alumno,alumno.ap_paterno_alumno,alumno.ap_materno_alumno, asistencia.asistencia
        FROM  asistencia INNER JOIN alumno ON 
        asistencia.id_alumno=alumno.id_alumno
        INNER JOIN clase ON
        clase.id_clase=asistencia.id_clase
        INNER JOIN curso ON
        curso.id_curso = clase.id_curso
        WHERE MONTH(fecha_clase) =?
        AND estado_asistencia = true
        AND curso.id_curso=?`;
        Db.query(query,[fecha,id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error'});
            }
            else{
                res.status(200).json(result);
            }
        }) ;
    }
    public async listaFechasAsistencia(req:Request,res:Response){
        const {id} = req.params;
        const queryFechas=`SELECT Month(fecha_clase) as mes 
        FROM  clase INNER JOIN curso ON
        curso.id_curso = clase.id_curso
        AND clase.estado_clase= true
        AND curso.id_curso=?
        group by mes`;
        Db.query(queryFechas,[id],function(errFecha,resultFecha,fieldsFecha){
            if(errFecha){
                res.status(500).json({text:errFecha});
            }
            else{                
                res.status(200).json(resultFecha);
            }
        }) ;
        
    }
    public async actualizarAsistencia(req:Request,res:Response){
        const {id} = req.params;
        const query = `UPDATE asistencia SET asistencia = true WHERE id_clase_alumno = ?`;
        Db.query(query,[id],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error en la actualización'});
                throw err;
            }else{
                res.status(200).json({text:'Asistencia registrada'});
            }
        });
    }


}


export const classController = new ClassController();