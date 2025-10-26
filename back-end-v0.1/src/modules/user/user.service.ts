import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { SendUserDTO } from "./dtos/create-user.dto";

@Injectable()
export class userService {
  constructor(
    @InjectRepository(User) private readonly fileRepository: Repository<User>
  ) {}

  //Get - /api/vi/userss
  async getAllUsers(): Promise<User[]> {
    return this.fileRepository.find();
  }

  /*
    async getAllUsers(){
        try{
            const [rows] = await pool.query("SELECT * FROM Usuarios");
            console.log(rows);
            return rows;
        }catch(error: any){
            console.log(error)
        }

    }
    */

  //Get - /api/vi/users/:id
  async getOnlyUser(id: number): Promise<User> {
    const user = await this.fileRepository.findOneBy({ idUsuario: id });
    if (!user) {
      throw new NotFoundException(`Registro com ID ${id} não encontrado`);
    }

    return user;
  }

  /*
    async getOnlyUser(id: number){
        const query = `select * from Usuarios where idUsuario = ${id}`;
        const [rows] = await pool.query(query);
        console.log(rows);
        return rows;
    }
    */

  //Post - /api/vi/users
  async postUser(data: SendUserDTO): Promise<User> {
    const newData = this.fileRepository.create(data as any); // Cria a instância da entidade
    const savedUser = await this.fileRepository.save(newData); // Salva a instância no banco de dados
    return Array.isArray(savedUser) ? savedUser[0] : savedUser;
  }

  /*
        async postUser(idUsuario: number, nomeCompleto: string, cpf: string, senha: string, email: string, contato: string, situacao: string, idCargo: number, dataCriacao: Date, ultimoAcesso: Date){
            const query = `insert into Usuarios(idUsuario, nomeCompleto, cpf, senha, email, contato, situacao, idCargo, dataCriacao, ultimoAcesso) values (${idUsuario}, '${nomeCompleto}', '${cpf}', '${senha}', '${email}', '${contato}', '${situacao}', ${idCargo}, '${dataCriacao}','${ultimoAcesso}')`;
            pool.query(query);
        }
    */

  //Put - /api/vi/users
  async putUserData(id: number, data: SendUserDTO): Promise<void> {
    await this.fileRepository.update(id, data as any); // Atualiza a instância da entidade
  }

  /*
        async putUserData(idUsuario: number, campos: string[], valores: string[]){ 
            console.log(`\nCampos originais: ${campos}`)
            console.log(`\nValores originais: ${valores}`)

            let sent = "";

            for( let i = 0; i  < campos.length; i++){
                sent = sent + "" + campos[i] + " = "  + valores[i];
                if(i < campos.length -1){
                    sent = sent + ",";
                }
            }

            console.log(`\nSentença para update: ${sent}`)

            console.log("\n")

            const query = `update Usuarios set ${sent} where idUsuario = ${idUsuario}`;
            pool.query(query);
        }
    */

  //Delete - /api/vi/users/:id
  async deleteOnlyUser(id: number) {
    const user = await this.fileRepository.delete({ idUsuario: id });
    if (!user) {
      throw new NotFoundException(`Registro com ID ${id} não encontrado`);
    }
  }

  /*
        async deleteOnlyUser(id: number){
            const query = `DELETE FROM Usuarios where idUsuario = ${id}`;
            try{
                await pool.query(query);
            }catch(error: any){
                console.log(error)
            }
        }
    */

  // ---------------------------------------------
  // Ignorar
  // ---------------------------------------------
  //Get - /api/vi/users/Permissions/:id
  /*
        async getUserPermission(id: number){
            const query = `select * from Usuario_Permissoes where idUsuario = ${id}`;
            const [rows] = await pool.query(query);
            console.log(rows);
            return rows;
        }

        //Post - /api/v1/user/permissions
        async postUserPermission( idUsuario: Number, idPermissao: Number){
            const query = `insert into Usuario_Permissoes(idUsuario, idPermissao) values (${idUsuario}, ${idPermissao})`;
            pool.query(query);
        }
        */
}
