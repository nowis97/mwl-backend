import { model, property} from '@loopback/repository';
import {User} from '@loopback/authentication-jwt';

@model()
export class Usuario extends User{

  @property({
    type:'array',
    itemType:'string'
  })
  rolesIds:string[]

   constructor(data?: Partial<Usuario & User>) {
       super(data);


   }

}

export interface UsuarioRelations {
  // describe navigational properties here
}

export type UsuariosWithRelations = User & UsuarioRelations;
