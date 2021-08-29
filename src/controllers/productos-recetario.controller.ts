import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Productos,
  Recetario,
} from '../models';
import {ProductosRepository} from '../repositories';

export class ProductosRecetarioController {
  constructor(
    @repository(ProductosRepository)
    public productosRepository: ProductosRepository,
  ) { }

  @get('/productos/{id}/recetario', {
    responses: {
      '200': {
        description: 'Recetario belonging to Productos',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Recetario)},
          },
        },
      },
    },
  })
  async getRecetario(
    @param.path.string('id') id: typeof Productos.prototype.id,
  ): Promise<Recetario> {
    return this.productosRepository.recetario(id);
  }
}
