import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {Productos, ProductosRelations, ProductoPersonalizado, Recetario} from '../models';
import {MwlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProductoPersonalizadoRepository} from './producto-personalizado.repository';
import {RecetarioRepository} from './recetario.repository';

export class ProductosRepository extends DefaultCrudRepository<
  Productos,
  typeof Productos.prototype.id,
  ProductosRelations
> {

  public readonly productoPersonalizado: HasOneRepositoryFactory<ProductoPersonalizado, typeof Productos.prototype.id>;

  public readonly recetario: HasOneRepositoryFactory<Recetario, typeof Productos.prototype.id>;

  constructor(
    @inject('datasources.mwl') dataSource: MwlDataSource, @repository.getter('ProductoPersonalizadoRepository') protected productoPersonalizadoRepositoryGetter: Getter<ProductoPersonalizadoRepository>, @repository.getter('RecetarioRepository') protected recetarioRepositoryGetter: Getter<RecetarioRepository>,
  ) {
    super(Productos, dataSource);

    this.productoPersonalizado = this.createHasOneRepositoryFactoryFor('productoPersonalizado', productoPersonalizadoRepositoryGetter);
    this.registerInclusionResolver('productoPersonalizado', this.productoPersonalizado.inclusionResolver);
  }
}
