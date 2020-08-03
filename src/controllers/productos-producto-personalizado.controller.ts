import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Productos,
  ProductoPersonalizado,
} from '../models';
import {ProductosRepository} from '../repositories';

export class ProductosProductoPersonalizadoController {
  constructor(
    @repository(ProductosRepository) protected productosRepository: ProductosRepository,
  ) { }

  @get('/productos/{id}/producto-personalizado', {
    responses: {
      '200': {
        description: 'Productos has one ProductoPersonalizado',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ProductoPersonalizado),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<ProductoPersonalizado>,
  ): Promise<ProductoPersonalizado> {
    return this.productosRepository.productoPersonalizado(id).get(filter);
  }

  @post('/productos/{id}/producto-personalizado', {
    responses: {
      '200': {
        description: 'Productos model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProductoPersonalizado)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Productos.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoPersonalizado, {
            title: 'NewProductoPersonalizadoInProductos',
            exclude: ['id'],
            optional: ['productosId']
          }),
        },
      },
    }) productoPersonalizado: Omit<ProductoPersonalizado, 'id'>,
  ): Promise<ProductoPersonalizado> {
    return this.productosRepository.productoPersonalizado(id).create(productoPersonalizado);
  }

  @patch('/productos/{id}/producto-personalizado', {
    responses: {
      '200': {
        description: 'Productos.ProductoPersonalizado PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductoPersonalizado, {partial: true}),
        },
      },
    })
    productoPersonalizado: Partial<ProductoPersonalizado>,
    @param.query.object('where', getWhereSchemaFor(ProductoPersonalizado)) where?: Where<ProductoPersonalizado>,
  ): Promise<Count> {
    return this.productosRepository.productoPersonalizado(id).patch(productoPersonalizado, where);
  }

  @del('/productos/{id}/producto-personalizado', {
    responses: {
      '200': {
        description: 'Productos.ProductoPersonalizado DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(ProductoPersonalizado)) where?: Where<ProductoPersonalizado>,
  ): Promise<Count> {
    return this.productosRepository.productoPersonalizado(id).delete(where);
  }
}
