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
import {Recetario} from '../models';
import {RecetarioRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

//@authenticate('jwt')
export class RecetariosController {
  constructor(
    @repository(RecetarioRepository)
    public recetarioRepository : RecetarioRepository,
  ) {}

  @post('/recetario', {
    responses: {
      '200': {
        description: 'Recetario model instance',
        content: {'application/json': {schema: getModelSchemaRef(Recetario)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recetario, {
            title: 'NewRecetario',
            exclude: ['id'],
          }),
        },
      },
    })
    recetario: Omit<Recetario, 'id'>,
  ): Promise<Recetario> {
    return this.recetarioRepository.create(recetario);
  }

  @get('/recetario/count', {
    responses: {
      '200': {
        description: 'Recetario model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Recetario) where?: Where<Recetario>,
  ): Promise<Count> {
    return this.recetarioRepository.count(where);
  }
  @get('/recetario', {
    responses: {
      '200': {
        description: 'Array of Recetario model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Recetario, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Recetario) filter?: Filter<Recetario>,
  ): Promise<Recetario[]> {
    return this.recetarioRepository.find(filter);
  }

  @patch('/recetario', {
    responses: {
      '200': {
        description: 'Recetario PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recetario, {partial: true}),
        },
      },
    })
    recetario: Recetario,
    @param.where(Recetario) where?: Where<Recetario>,
  ): Promise<Count> {
    return this.recetarioRepository.updateAll(recetario, where);
  }

  @get('/recetario/{id}', {
    responses: {
      '200': {
        description: 'Recetario model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Recetario, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Recetario, {exclude: 'where'}) filter?: FilterExcludingWhere<Recetario>
  ): Promise<Recetario> {
    return this.recetarioRepository.findById(id, filter);
  }

  @patch('/recetario/{id}', {
    responses: {
      '204': {
        description: 'Recetario PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recetario, {partial: true}),
        },
      },
    })
    recetario: Recetario,
  ): Promise<void> {
    await this.recetarioRepository.updateById(id, recetario);
  }

  @put('/recetario/{id}', {
    responses: {
      '204': {
        description: 'Recetario PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() recetario: Recetario,
  ): Promise<void> {
    await this.recetarioRepository.replaceById(id, recetario);
  }

  @del('/recetario/{id}', {
    responses: {
      '204': {
        description: 'Recetario DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.recetarioRepository.deleteById(id);
  }
}
