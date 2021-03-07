import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer} from '@loopback/authorization';
import  {Provider} from '@loopback/core'
import {RestBindings,Request} from '@loopback/rest';
import {UserServiceBindings} from '@loopback/authentication-jwt';
import {repository} from '@loopback/repository';
import {UsuarioRepository} from '../repositories';
import {Roles} from '../models';

export class AuthorizationServiceProvider implements Provider<Authorizer>{

   readonly METHOD_TO_CRUD : Record<string, string> = {
    "GET":"view",
    "POST":"create",
    "PUT":"edit",
    "PATCH":"edit",
    "DELETE":"delete"
  };

   constructor(@repository(UsuarioRepository) private usuarioRepository:UsuarioRepository) {
   }


  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata:AuthorizationMetadata
  ){

    const request = await authorizationCtx.invocationContext.get(RestBindings.Http.REQUEST);

    const userService = await authorizationCtx.invocationContext.get(UserServiceBindings.USER_SERVICE);

    // @ts-ignore
    const email = await userService.getEmailFromToken( await this.extractToken(request))

    const usuario = await this.usuarioRepository.getUsuarioByEmail(email);

    const roles = await this.usuarioRepository.getRoles(usuario?.rolesIds ?? [])

    return this.enforce(roles,metadata.resource ?? '',this.METHOD_TO_CRUD[request.method]);

  }


 async extractToken(req:Request):Promise<string> {

   return req.headers.authorization?.split(' ')[1] ?? ''


 }
 async enforce(roles:Roles[],recurso:string,permiso:string){
     const permisosRecursosAllRoles = roles.map(val => val.permisosRecursos).flat()

     const resourceFound = permisosRecursosAllRoles.find(obj => obj.recurso === recurso);

     if (!resourceFound) return AuthorizationDecision.ABSTAIN;

     const permisos = resourceFound.permisos as string[];

     const permisoFound =  permisos.find(obj => obj === permiso);

     if (!permisoFound) return AuthorizationDecision.DENY;

     return AuthorizationDecision.ALLOW;

 }

}