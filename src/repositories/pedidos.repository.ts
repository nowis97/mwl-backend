import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Pedidos, PedidosRelations, Clientes} from '../models';
import {MwlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ClientesRepository} from './clientes.repository';

export class PedidosRepository extends DefaultCrudRepository<
  Pedidos,
  typeof Pedidos.prototype.id,
  PedidosRelations
> {

  public readonly clientes: BelongsToAccessor<Clientes, typeof Pedidos.prototype.id>;

  constructor(
    @inject('datasources.mwl') dataSource: MwlDataSource, @repository.getter('ClientesRepository') protected clientesRepositoryGetter: Getter<ClientesRepository>,
  ) {
    super(Pedidos, dataSource);
    this.clientes = this.createBelongsToAccessorFor('clientes', clientesRepositoryGetter,);
    this.registerInclusionResolver('clientes', this.clientes.inclusionResolver);

  }
}
