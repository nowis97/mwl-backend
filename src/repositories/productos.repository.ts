import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {Productos, ProductosRelations, ProductoPersonalizado} from '../models';
import {MwlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProductoPersonalizadoRepository} from './producto-personalizado.repository';

export class ProductosRepository extends DefaultCrudRepository<
  Productos,
  typeof Productos.prototype.id,
  ProductosRelations
> {

  public readonly productoPersonalizado: HasOneRepositoryFactory<ProductoPersonalizado, typeof Productos.prototype.id>;



  constructor(
    @inject('datasources.mwl') dataSource: MwlDataSource, @repository.getter('ProductoPersonalizadoRepository') protected productoPersonalizadoRepositoryGetter: Getter<ProductoPersonalizadoRepository>
  ) {
    super(Productos, dataSource);

    this.productoPersonalizado = this.createHasOneRepositoryFactoryFor('productoPersonalizado', productoPersonalizadoRepositoryGetter);
    this.registerInclusionResolver('productoPersonalizado', this.productoPersonalizado.inclusionResolver);
  }
}
