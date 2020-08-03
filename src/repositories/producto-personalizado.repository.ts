import {DefaultCrudRepository} from '@loopback/repository';
import {ProductoPersonalizado, ProductoPersonalizadoRelations} from '../models';
import {MwlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ProductoPersonalizadoRepository extends DefaultCrudRepository<
  ProductoPersonalizado,
  typeof ProductoPersonalizado.prototype.id,
  ProductoPersonalizadoRelations
> {
  constructor(
    @inject('datasources.mwl') dataSource: MwlDataSource,
  ) {
    super(ProductoPersonalizado, dataSource);
  }
}
