import {DefaultCrudRepository} from '@loopback/repository';
import {Clientes, ClientesRelations} from '../models';
import {MwlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ClientesRepository extends DefaultCrudRepository<
  Clientes,
  typeof Clientes.prototype.id,
  ClientesRelations
> {
  constructor(
    @inject('datasources.mwl') dataSource: MwlDataSource,
  ) {
    super(Clientes, dataSource);
  }
}
