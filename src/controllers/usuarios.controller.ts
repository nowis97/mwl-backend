import {authenticate, TokenService, UserService} from '@loopback/authentication';
import {Credentials, TokenServiceBindings, User, UserServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {Count, CountSchema, Filter, model, property, repository, Where} from '@loopback/repository';
import {get, getModelSchemaRef, param, post, put, requestBody,HttpErrors, SchemaObject} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {authorize} from '@loopback/authorization';
import {Roles, Usuario} from '../models';
import {RolesRepository, UsuarioRepository} from '../repositories';
import {resolveAny} from 'dns';


@model()
export class NewUserRequest extends Usuario {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};
export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User,Credentials>,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UsuarioRepository) protected userRepository: UsuarioRepository,
    @repository(RolesRepository) protected rolesRepository:RolesRepository
  ) {}
  @authenticate.skip()
  @post('/usuarios/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{user: {roles: any; name: string | undefined; email: string | undefined}; token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {token, user:{email:userProfile.email, name:user.username,roles:userProfile.roles}};
  }

  @get('/usuarios/quiensoy/{token}', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(@param.path.string('token') token: string | undefined,
  ): Promise<object> {
    if (!token) throw new HttpErrors.PreconditionRequired('No token found');

    const userprofile = await this.jwtService.verifyToken(token);

    if (!userprofile) throw new HttpErrors.Unauthorized('Invalid token')

    // @ts-ignore
    const usuario = await this.userRepository.getUsuarioByEmail( await this.userService.getEmailFromToken(token));

    const roles = await this.userRepository.getRoles(usuario?.rolesIds ?? []);

    return {
      id: usuario?.id,
      username:usuario?.username,
      email:usuario?.email,
      roles: roles
    }





  }

  @get('/usuarios', {
    responses: {
      200: {
        description: 'Obtiene los usuarios',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                'x-ts-type': Usuario,
              },
            },
          },
        },
      },
    },
  })
  async getUsuarios(
    @param.filter(User) filter?: Filter<User>,
  ):Promise<User[]> {
    return this.userRepository.find(filter)
  }

  @get('/usuarios/{id}',{
    responses: {
      '200': {
        description: 'Usuario model instance',
        content: {
          'application/json': {
            schema: {
              'x-ts-type':User
            },
          },
        },
      },
    },
  })async getUsuario(
    @param.path.string('id') id:string
  ):Promise<User>{
    return this.userRepository.findById(id)
  }

  @get('/usuarios/repartidores',{
    responses:{
      '200':{
        description:'Users that have rol "Repartidor"',
        content:{'application/json':{schema: {
          type:'array',
              itemType:getModelSchemaRef(Usuario)
        }}}
      }
    }
  })async getUsuariosRepartidores():Promise<Usuario[]>{

    const rolRepatidor = await this.rolesRepository.findOne({where: {nombre:'Repartidor'}})

    const usuariosRepartidores = await this.userRepository.find({where:{rolesIds:{inq:[rolRepatidor?.id]}}})

    return usuariosRepartidores;

  }

  @get('/usuarios/count', {
    responses: {
      '200': {
        description: 'Subcategoria model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })async count(@param.where(User) where?:Where<User>):Promise<Count>{
    return this.userRepository.count(where);
  }

  @put('/usuarios/{id}', {
    responses: {
      '204': {
        description: 'Usuario PUT success',
      },
    },
  })
  async actualizarUsuario(
    @param.path.string('id') id:string,
    @requestBody() usuario:User
  ){
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    let actualUserId :any = undefined;
    if (usuario.verificationToken){
      actualUserId = ((await this.whoAmI(usuario.verificationToken)) as any).id

    }

    if (!usuario.password) throw new HttpErrors.PreconditionFailed('Password required')

    const password = await hash(usuario.password, await genSalt());


    await this.userRepository.replaceById( actualUserId || id,
      _.omit(usuario, 'password')
      )

   await this.userRepository.userCredentials(actualUserId || id).patch({password})
  }

  @authenticate.skip()
  @post('/usuarios', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
      newUserRequest: NewUserRequest,
  ): Promise<User> {
    const password = await hash(newUserRequest.password, await genSalt());
    const savedUser = await this.userRepository.create(
      _.omit(newUserRequest, 'password'),
    );

    await this.userRepository.userCredentials(savedUser.id).create({password});

    return savedUser;
  }
}
