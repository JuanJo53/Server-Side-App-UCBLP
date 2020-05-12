import{Entity,Column,PrimaryGeneratedColumn} from 'typeorm';
import bcrypt from 'bcrypt';
@Entity()
export class Teacher{
    @PrimaryGeneratedColumn("increment")
    id_docente:bigint;
    
    @Column()
    nombre_docente:string;
    
    @Column()
    ap_pat_docente:string; 

    @Column()
    ap_mat_docente:string;

    @Column()
    correo_docente:string;

    @Column()
    contrasenia_docente:string;

    @Column()
    estado_docente:number;

    criptPassword():void{
        const salt=bcrypt.genSaltSync(10);
        this.contrasenia_docente=bcrypt.hashSync(this.contrasenia_docente,salt);
    }
    //!!Verificar si funciona cuando las funciones son asyncronas
    checkPassword(password:string):boolean{
        return bcrypt.compareSync(password,this.contrasenia_docente);
    }
}