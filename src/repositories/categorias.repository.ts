import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Categorias, CategoriasRelations, Subcategoria} from '../models';
import {MwlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {SubcategoriaRepository} from './subcategoria.repository';

export class CategoriasRepository extends DefaultCrudRepository<
  Categorias,
  typeof Categorias.prototype.id,
  CategoriasRelations
> {

  public readonly subcategorias: HasManyRepositoryFactory<Subcategoria, typeof Categorias.prototype.id>;

  constructor(
    @inject('datasources.mwl') dataSource: MwlDataSource, @repository.getter('SubcategoriaRepository') protected subcategoriaRepositoryGetter: Getter<SubcategoriaRepository>,
  ) {
    super(Categorias, dataSource);

  }
}
