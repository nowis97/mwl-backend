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
import {Subcategoria} from '../models';
import {SubcategoriaRepository} from '../repositories';

export class SubcategoriasController {
  constructor(
    @repository(SubcategoriaRepository)
    public subcategoriaRepository : SubcategoriaRepository,
  ) {}

  @post('/subcategorias', {
    responses: {
      '200': {
        description: 'Subcategoria model instance',
        content: {'application/json': {schema: getModelSchemaRef(Subcategoria)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Subcategoria, {
            title: 'NewSubcategoria',
            exclude: ['id'],
          }),
        },
      },
    })
    subcategoria: Omit<Subcategoria, 'id'>,
  ): Promise<Subcategoria> {
    return this.subcategoriaRepository.create(subcategoria);
  }

  @get('/subcategorias/count', {
    responses: {
      '200': {
        description: 'Subcategoria model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Subcategoria) where?: Where<Subcategoria>,
  ): Promise<Count> {
    return this.subcategoriaRepository.count(where);
  }

  @get('/subcategorias', {
    responses: {
      '200': {
        description: 'Array of Subcategoria model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Subcategoria, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Subcategoria) filter?: Filter<Subcategoria>,
  ): Promise<Subcategoria[]> {
    return this.subcategoriaRepository.find(filter);
  }

  @patch('/subcategorias', {
    responses: {
      '200': {
        description: 'Subcategoria PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Subcategoria, {partial: true}),
        },
      },
    })
    subcategoria: Subcategoria,
    @param.where(Subcategoria) where?: Where<Subcategoria>,
  ): Promise<Count> {
    return this.subcategoriaRepository.updateAll(subcategoria, where);
  }

  @get('/subcategorias/{id}', {
    responses: {
      '200': {
        description: 'Subcategoria model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Subcategoria, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Subcategoria, {exclude: 'where'}) filter?: FilterExcludingWhere<Subcategoria>
  ): Promise<Subcategoria> {
    return this.subcategoriaRepository.findById(id, filter);
  }

  @patch('/subcategorias/{id}', {
    responses: {
      '204': {
        description: 'Subcategoria PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Subcategoria, {partial: true}),
        },
      },
    })
    subcategoria: Subcategoria,
  ): Promise<void> {
    await this.subcategoriaRepository.updateById(id, subcategoria);
  }

  @put('/subcategorias/{id}', {
    responses: {
      '204': {
        description: 'Subcategoria PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() subcategoria: Subcategoria,
  ): Promise<void> {
    await this.subcategoriaRepository.replaceById(id, subcategoria);
  }

  @del('/subcategorias/{id}', {
    responses: {
      '204': {
        description: 'Subcategoria DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.subcategoriaRepository.deleteById(id);
  }
}
