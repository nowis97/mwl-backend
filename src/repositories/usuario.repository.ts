import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {Roles, Usuario, UsuarioRelations} from '../models';
import {MwlDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';
import {UserCredentialsRepository} from '@loopback/authentication-jwt/src/repositories/user-credentials.repository';
import {UserCredentials} from '@loopback/authentication-jwt';
import {RolesRepository} from './roles.repository';
// @ts-ignore
import {ObjectID} from 'loopback-connector-mongodb/lib/mongodb'
export class UsuarioRepository extends DefaultCrudRepository<
  Usuario,
  typeof Usuario.prototype.id,
  UsuarioRelations
> {

  public readonly userCredentials: HasOneRepositoryFactory<UserCredentials, typeof Usuario.prototype.id>
  constructor(
    @inject('datasources.mwl') dataSource: MwlDataSource,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
    @repository(RolesRepository)
    public rolesRepository: RolesRepository
  ) {
    super(Usuario, dataSource);

    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter
    )

    this.registerInclusionResolver(
      'userCredentials',
      this.userCredentials.inclusionResolver,
    );


  }

  async findCredentials(id:typeof Usuario.prototype.id):Promise<UserCredentials>{
    return this.userCredentials(id).get()
  }

  async getRoles(ids:string[]):Promise<Roles[]> {

    const objIds = ids.map(ObjectID);

    const query = await this.dataSource.execute('Roles', 'aggregate', [
      {
        '$match': {
          '_id': {
            '$in': objIds
          }
        }
      }, {
        '$unwind': {
          'path': '$permisosRecursos'
        }
      }, {
        '$addFields': {
          'permisosRecursos.recursoId': {
            '$toObjectId': '$permisosRecursos.recurso'
          }
        }
      }, {
        '$lookup': {
          'from': 'Recursos',
          'localField': 'permisosRecursos.recursoId',
          'foreignField': '_id',
          'as': 'permisosRecursos.recurso'
        }
      }, {
        '$unwind': {
          'path': '$permisosRecursos.recurso'
        }
      }, {
        '$project': {
          'nombre': true,
          'permisosRecursos.recurso': '$permisosRecursos.recurso.nombre',
          'permisosRecursos.permisos': true
        }
      }, {
        '$group': {
          '_id': '$_id',
          'nombre': {
            '$first': '$nombre'
          },
          'permisosRecursos': {
            '$push': '$permisosRecursos'
          }
        }
      }
    ])

    return query.toArray();


  }

  async getUsuarioByEmail(email:string):Promise<Usuario | null>{
    return this.findOne({where:{'email':email}})
  }





}
