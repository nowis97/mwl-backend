import {DefaultCrudRepository} from '@loopback/repository';
import {Producciones, ProduccionesRelations} from '../models';
import {MwlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ProduccionesRepository extends DefaultCrudRepository<
  Producciones,
  typeof Producciones.prototype.id,
  ProduccionesRelations
> {
  constructor(
    @inject('datasources.mwl') dataSource: MwlDataSource,
  ) {
    super(Producciones, dataSource);
  }
}
