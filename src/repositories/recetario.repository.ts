import {DefaultCrudRepository, repository} from '@loopback/repository';
import {Recetario, RecetarioRelations} from '../models';
import {MwlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {InventarioRepository} from './inventario.repository';

export class RecetarioRepository extends DefaultCrudRepository<
  Recetario,
  typeof Recetario.prototype.id,
  RecetarioRelations
> {


  constructor(
    @inject('datasources.mwl') dataSource: MwlDataSource, @repository.getter('InventarioRepository') protected inventarioRepositoryGetter: Getter<InventarioRepository>,
  ) {
    super(Recetario, dataSource);

  }
}
