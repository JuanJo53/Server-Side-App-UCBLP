import{Request,Response} from 'express';
import Db from '../../Database'; 
import {NotaModuloPersRequest} from '../../model/NotaModuloPersRequest'
class ModuloAlumnoController{
public async listarNombreModulos(req:Request,res:Response){
        const {id}=req.params;
        const idAlumno = req.estudianteId;
        const query =`SELECT modu.id_modulo,modu.nombre_modulo
        FROM modulo modu 
        JOIN curso cur ON 
        cur.id_curso=modu.id_curso
        JOIN curso_alumno ca ON
        ca.id_curso=cur.id_curso
        JOIN alumno alu ON
        alu.id_alumno = ca.id_alumno
        WHERE modu.estado_modulo!=false
        AND cur.estado_curso=true
        AND ca.estado_curso_alumno=true
        AND alu.estado_alumno = true
        AND cur.id_curso=?
        AND alu.id_alumno = ?`;
        Db.query(query,[id,idAlumno],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al cargar imagenes'});
            }
            else{
                res.status(200).json(result);
            }
        });  
 
    }
    public async listarNotasModulos(req:Request,res:Response){
        const {id}=req.params;
        const idAlumno = req.estudianteId;
        const query =`SELECT modu.id_modulo,modu.nombre_modulo, nm.nota_modulo
        FROM modulo modu 
        JOIN curso cur ON 
        cur.id_curso=modu.id_curso
        JOIN curso_alumno ca ON
        ca.id_curso=cur.id_curso
        JOIN alumno alu ON
        alu.id_alumno = ca.id_alumno
        JOIN nota_modulo nm ON
        nm.id_modulo=modu.id_modulo
        WHERE modu.estado_modulo!=false
        AND alu.id_alumno = nm.id_alumno
        AND cur.estado_curso=true
        AND ca.estado_curso_alumno=true
        AND alu.estado_alumno = true
        AND cur.id_curso=?
        AND alu.id_alumno = ?`;
        Db.query(query,[id,idAlumno],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al cargar imagenes'});
            }
            else{
                res.status(200).json(result);
            }
        });  
 
    }
    public async modulosPersonalizadosSimple(req:Request,res:Response){
        const {id}=req.params;
        const idAlumno = req.estudianteId;
        const query =`SELECT modu.id_modulo, modu.nombre_modulo
        FROM modulo modu 
        JOIN curso cur ON 
        cur.id_curso=modu.id_curso
        JOIN curso_alumno ca ON
        ca.id_curso=cur.id_curso
        JOIN alumno alu ON
        alu.id_alumno = ca.id_alumno
        JOIN nota_modulo nm ON
        nm.id_modulo=modu.id_modulo
        WHERE modu.estado_modulo!=false
        AND alu.id_alumno = nm.id_alumno
        AND cur.estado_curso=true
        AND ca.estado_curso_alumno=true
        AND alu.estado_alumno = true
        AND modu.estado_modulo=1
        AND cur.id_curso=?
        AND alu.id_alumno = ?
        AND modu.id_tipo_modulo=2`;
        Db.query(query,[id,idAlumno],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al cargar los modulos personalizados'});
            }
            else{
                res.status(200).json(result);
            }
        });  
 
    }
    public async scoreModuloPersonalizado(req:Request,res:Response){
        const {id}=req.params;
        const idAlumno = req.estudianteId;
        const query =`SELECT cmp.nombre_contenido,
        ncon.nota_contenido,
        cmp.rubrica_contenido,
        color.valor as color
        FROM nota_contenido ncon        
        JOIN contenido_mod_per cmp ON
		cmp.id_contenido_mod_per=ncon.id_contenido_mod_per
        JOIN modulo modu ON
        modu.id_modulo=cmp.id_modulo
        JOIN color ON
        modu.id_color=color.id_color
        JOIN curso cur ON 
        cur.id_curso=modu.id_curso
        JOIN curso_alumno ca ON
        ca.id_curso=cur.id_curso
        JOIN alumno alu ON
        alu.id_alumno = ca.id_alumno
        JOIN nota_modulo nm ON
        nm.id_modulo=modu.id_modulo
        WHERE modu.estado_modulo!=false
        AND alu.id_alumno = nm.id_alumno
        AND cur.estado_curso=true
        AND ca.estado_curso_alumno=true
        AND alu.estado_alumno = true
        AND modu.id_modulo=?
        AND ncon.id_alumno=?
        AND ncon.estado_nota_contenido=1
        AND cmp.estado_contenido_mod_per=1
        AND alu.id_alumno = ?
        AND modu.id_tipo_modulo=2`;
        Db.query(query,[id,idAlumno,idAlumno],function(err,result,fields){
            if(err){
                res.status(500).json({text:'Error al cargar los modulos personalizados'});
            }
            else{

                res.status(200).json(result);
            }
        });  
 
    }
}

export const moduloAlumnoController=new ModuloAlumnoController();