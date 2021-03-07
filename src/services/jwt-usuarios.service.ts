import {UserService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
import {HttpErrors} from '@loopback/rest';
import {securityId,UserProfile} from '@loopback/security';
import {compare} from 'bcrypt';
import jwtDecode from 'jwt-decode';
export type Credentials = {
  email:string,
  password:string
}

export class CustomUserService implements  UserService<Usuario, Credentials>{


  constructor(@repository(UsuarioRepository) public usuariosRepository:UsuarioRepository) {
  }

   async getEmailFromToken(token:string):Promise<string>{
    const tokenObj = jwtDecode(token) as unknown;

    // @ts-ignore
     return tokenObj?.email ?? ''

   }

  async verifyCredentials(credentials: Credentials): Promise<Usuario> {
    const foundUser = await this.usuariosRepository.findOne({
      where: {email: credentials.email}
    })

    if (!foundUser)
      throw new HttpErrors.Unauthorized('Invalid email or password');

    const credentialsFound = await this.usuariosRepository.findCredentials(foundUser.id)

    if (!credentialsFound)
      throw new HttpErrors.Unauthorized('Invalid email or password');


    if (!await compare(credentials.password,credentialsFound.password))
      throw new HttpErrors.Unauthorized('Invalid email or password');

    return foundUser
  }

  convertToUserProfile(user: Usuario): UserProfile {
    return {
      [securityId]: user.id?.toString() ?? '',
      name: user.name,
      email:user.email,
      roles:user.rolesIds

    }
  }


}
