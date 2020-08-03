import {DefaultCrudRepository} from '@loopback/repository';
import {Recetario, RecetarioRelations} from '../models';
import {MwlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class RecetarioRepository extends DefaultCrudRepository<
  Recetario,
  typeof Recetario.prototype.id,
  RecetarioRelations
> {
  constructor(
    @inject('datasources.mwl') dataSource: MwlDataSource,
  ) {
    super(Recetario, dataSource);
  }
}
