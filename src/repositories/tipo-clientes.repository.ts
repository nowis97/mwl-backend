import {DefaultCrudRepository} from '@loopback/repository';
import {TipoClientes, TipoClientesRelations} from '../models';
import {MwlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TipoClientesRepository extends DefaultCrudRepository<
  TipoClientes,
  typeof TipoClientes.prototype.id,
  TipoClientesRelations
> {
  constructor(
    @inject('datasources.mwl') dataSource: MwlDataSource,
  ) {
    super(TipoClientes, dataSource);
  }
}
