import {DefaultCrudRepository} from '@loopback/repository';
import {Recursos, RecursosRelations} from '../models';
import {MwlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class RecursosRepository extends DefaultCrudRepository<
  Recursos,
  typeof Recursos.prototype.id,
  RecursosRelations
> {
  constructor(
    @inject('datasources.mwl') dataSource: MwlDataSource,
  ) {
    super(Recursos, dataSource);
  }
}
