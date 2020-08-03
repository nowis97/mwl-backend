import {DefaultCrudRepository} from '@loopback/repository';
import {CategoriasInventario, CategoriasInventarioRelations} from '../models';
import {MwlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CategoriasInventarioRepository extends DefaultCrudRepository<
  CategoriasInventario,
  typeof CategoriasInventario.prototype.id,
  CategoriasInventarioRelations
> {
  constructor(
    @inject('datasources.mwl') dataSource: MwlDataSource,
  ) {
    super(CategoriasInventario, dataSource);
  }
}
