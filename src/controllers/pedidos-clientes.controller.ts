import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Pedidos,
  Clientes,
} from '../models';
import {PedidosRepository} from '../repositories';

export class PedidosClientesController {
  constructor(
    @repository(PedidosRepository)
    public pedidosRepository: PedidosRepository,
  ) { }

  @get('/pedidos/{id}/clientes', {
    responses: {
      '200': {
        description: 'Clientes belonging to Pedidos',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Clientes)},
          },
        },
      },
    },
  })
  async getClientes(
    @param.path.string('id') id: typeof Pedidos.prototype.id,
  ): Promise<Clientes> {
    return this.pedidosRepository.clientes(id);
  }
}
