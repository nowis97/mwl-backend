import {DefaultCrudRepository} from '@loopback/repository';
import {Subcategoria, SubcategorisRelations} from '../models';
import {MwlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class SubcategoriaRepository extends DefaultCrudRepository<
  Subcategoria,
  typeof Subcategoria.prototype.id,
  SubcategorisRelations
> {
  constructor(
    @inject('datasources.mwl') dataSource: MwlDataSource,
  ) {
    super(Subcategoria, dataSource);
  }
}
