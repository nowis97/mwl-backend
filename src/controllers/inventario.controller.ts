import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Inventario} from '../models';
import roundTo from 'round-to';
import {InventarioRepository} from '../repositories';

export class InventarioController {
  constructor(
    @repository(InventarioRepository)
    public inventarioRepository : InventarioRepository,
  ) {}

  @post('/inventario', {
    responses: {
      '200': {
        description: 'Inventario model instance',
        content: {'application/json': {schema: getModelSchemaRef(Inventario)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inventario, {
            title: 'NewInventario',
            exclude: ['id'],
          }),
        },
      },
    })
    inventario: Omit<Inventario, 'id'>,
  ): Promise<Inventario> {

    const costoUnitario = roundTo((inventario.precio / inventario.cantidad),2);

    inventario.costoUnitario = costoUnitario || 0;

    return this.inventarioRepository.create(inventario);

  }

  @get('/inventario/count', {
    responses: {
      '200': {
        description: 'Inventario model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Inventario) where?: Where<Inventario>,
  ): Promise<Count> {
    return this.inventarioRepository.count(where);
  }

  @get('/inventario', {
    responses: {
      '200': {
        description: 'Array of Inventario model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Inventario, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Inventario) filter?: Filter<Inventario>,
  ): Promise<Inventario[]> {
    return this.inventarioRepository.find(filter);
  }

  @patch('/inventario', {
    responses: {
      '200': {
        description: 'Inventario PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inventario, {partial: true}),
        },
      },
    })
    inventario: Inventario,
    @param.where(Inventario) where?: Where<Inventario>,
  ): Promise<Count> {
    return this.inventarioRepository.updateAll(inventario, where);
  }

  @get('/inventario/{id}', {
    responses: {
      '200': {
        description: 'Inventario model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Inventario, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Inventario, {exclude: 'where'}) filter?: FilterExcludingWhere<Inventario>
  ): Promise<Inventario> {
    return this.inventarioRepository.findById(id, filter);
  }

  @patch('/inventario/{id}', {
    responses: {
      '204': {
        description: 'Inventario PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inventario, {partial: true}),
        },
      },
    })
    inventario: Inventario,
  ): Promise<void> {
    await this.inventarioRepository.updateById(id, inventario);
  }

  @put('/inventario/{id}', {
    responses: {
      '204': {
        description: 'Inventario PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() inventario: Inventario,
  ): Promise<void> {
    inventario.costoUnitario = roundTo(inventario.precio/inventario.cantidad,2);
    await this.inventarioRepository.replaceById(id, inventario);
  }

  @del('/inventario/{id}', {
    responses: {
      '204': {
        description: 'Inventario DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.inventarioRepository.deleteById(id);
  }
}
