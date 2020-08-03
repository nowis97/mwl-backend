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
import {CategoriasInventario} from '../models';
import {CategoriasInventarioRepository} from '../repositories';

export class CategoriasInventarioController {
  constructor(
    @repository(CategoriasInventarioRepository)
    public categoriasInventarioRepository : CategoriasInventarioRepository,
  ) {}

  @post('/categorias-inventario', {
    responses: {
      '200': {
        description: 'CategoriasInventario model instance',
        content: {'application/json': {schema: getModelSchemaRef(CategoriasInventario)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CategoriasInventario, {
            title: 'NewCategoriasInventario',
            exclude: ['id'],
          }),
        },
      },
    })
    categoriasInventario: Omit<CategoriasInventario, 'id'>,
  ): Promise<CategoriasInventario> {
    return this.categoriasInventarioRepository.create(categoriasInventario);
  }

  @get('/categorias-inventario/count', {
    responses: {
      '200': {
        description: 'CategoriasInventario model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(CategoriasInventario) where?: Where<CategoriasInventario>,
  ): Promise<Count> {
    return this.categoriasInventarioRepository.count(where);
  }

  @get('/categorias-inventario', {
    responses: {
      '200': {
        description: 'Array of CategoriasInventario model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(CategoriasInventario, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(CategoriasInventario) filter?: Filter<CategoriasInventario>,
  ): Promise<CategoriasInventario[]> {
    return this.categoriasInventarioRepository.find(filter);
  }

  @patch('/categorias-inventario', {
    responses: {
      '200': {
        description: 'CategoriasInventario PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CategoriasInventario, {partial: true}),
        },
      },
    })
    categoriasInventario: CategoriasInventario,
    @param.where(CategoriasInventario) where?: Where<CategoriasInventario>,
  ): Promise<Count> {
    return this.categoriasInventarioRepository.updateAll(categoriasInventario, where);
  }

  @get('/categorias-inventario/{id}', {
    responses: {
      '200': {
        description: 'CategoriasInventario model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(CategoriasInventario, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(CategoriasInventario, {exclude: 'where'}) filter?: FilterExcludingWhere<CategoriasInventario>
  ): Promise<CategoriasInventario> {
    return this.categoriasInventarioRepository.findById(id, filter);
  }

  @patch('/categorias-inventario/{id}', {
    responses: {
      '204': {
        description: 'CategoriasInventario PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CategoriasInventario, {partial: true}),
        },
      },
    })
    categoriasInventario: CategoriasInventario,
  ): Promise<void> {
    await this.categoriasInventarioRepository.updateById(id, categoriasInventario);
  }

  @put('/categorias-inventario/{id}', {
    responses: {
      '204': {
        description: 'CategoriasInventario PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() categoriasInventario: CategoriasInventario,
  ): Promise<void> {
    await this.categoriasInventarioRepository.replaceById(id, categoriasInventario);
  }

  @del('/categorias-inventario/{id}', {
    responses: {
      '204': {
        description: 'CategoriasInventario DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.categoriasInventarioRepository.deleteById(id);
  }
}
