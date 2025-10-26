import { Logger, Controller, Post, Get, Param, Put, Delete, Body, UsePipes, ValidationPipe } from '@nestjs/common';

import { userService } from './user.service';
import {SendUserDTO} from "./dtos/create-user.dto";
import { User } from './entities/user.entity';
//import {PostUserPermissionsSchema} from "./users.schema";


@Controller('users')
export class UserController{
    constructor(
        private readonly UserService: userService,
    ) {}


    //Get - /api/vi/users
    @Get('')
    async getall(): Promise<User[]>{
        const users = await this.UserService.getAllUsers();
        console.log('Dados retornados:', users);
        return users;
    };


    //Get - /api/vi/users/:id
    @Get(':id')
    async getOnly(@Param('id') id: String){
        try{
            return this.UserService.getOnlyUser(Number(id));
        }catch(error: any){
            console.log("Erro ao listar usuários")
        }
    };

    //Post - /api/vi/users
    @Post('')
    async createData(@Body() body: SendUserDTO){        
        try{
            return this.UserService.postUser(body);
        
            
        } catch (error: any) {
            console.error("Erro ao enviar dados de novo usuário:", error);
        }
    
    };

    //Put - /api/vi/users/:id
    @Put(':id')
    async putData(@Body() body: SendUserDTO, @Param('id') id: Number){        
        try{
            const result = await this.UserService.putUserData(Number(id), body);
    
        } catch (error: any) {
            console.error("Erro ao enviar dados de novo usuário:", error);
        }
    }; 


    //Delete - /api/vi/users/:id
    @Delete(':id')
    async delete(@Param('id') id: Number){
        try{
            this.UserService.deleteOnlyUser(Number(id));
            
        }catch(error: any){
            console.log("Erro ao listar usuários")
        
        }
    };


    // ---------------------------------------------
    // Ignorar
    // ---------------------------------------------

    /*
        //Post - /api/vi/users/Permissions
        @Post('/api/v1/users/Permissions')
        async createUserPermission(): Promise<userEntity[]>{
            const { idUsuario, idPermissao} = req.body;
            
            try{
                const result = await this.UserService.postUserPermission(
                    idUsuario, 
                    idPermissao, 
                );
        
                res.json({ success: true, result });
            } catch (error: any) {
                console.error("Erro ao enviar dados das credenciais de usuáio:", error);
                res.status(500).json({ success: false, error: error.message });
            }
        }; 

        //Get - /api/vi/users/Permissions/:id
        @Get('/api/v1/users/Permissions/:id')
        async getOnlyPermission(@Param('id') id: String){
            
            try{
                this.UserService.getUserPermission(Number(id));

            }catch(error: any){
                console.log("Erro ao listar usuários")
                
            }
        };
    */

}