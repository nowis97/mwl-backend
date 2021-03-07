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
import {Recursos} from '../models';
import {RecursosRepository} from '../repositories';

export class RecursosController {
  constructor(
    @repository(RecursosRepository)
    public recursosRepository : RecursosRepository,
  ) {}

  @post('/recursos', {
    responses: {
      '200': {
        description: 'Recursos model instance',
        content: {'application/json': {schema: getModelSchemaRef(Recursos)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recursos, {
            title: 'NewRecursos',
            exclude: ['id'],
          }),
        },
      },
    })
    recursos: Omit<Recursos, 'id'>,
  ): Promise<Recursos> {
    return this.recursosRepository.create(recursos);
  }

  @get('/recursos/count', {
    responses: {
      '200': {
        description: 'Recursos model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Recursos) where?: Where<Recursos>,
  ): Promise<Count> {
    return this.recursosRepository.count(where);
  }

  @get('/recursos', {
    responses: {
      '200': {
        description: 'Array of Recursos model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Recursos, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Recursos) filter?: Filter<Recursos>,
  ): Promise<Recursos[]> {
    return this.recursosRepository.find(filter);
  }

  @patch('/recursos', {
    responses: {
      '200': {
        description: 'Recursos PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recursos, {partial: true}),
        },
      },
    })
    recursos: Recursos,
    @param.where(Recursos) where?: Where<Recursos>,
  ): Promise<Count> {
    return this.recursosRepository.updateAll(recursos, where);
  }

  @get('/recursos/{id}', {
    responses: {
      '200': {
        description: 'Recursos model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Recursos, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Recursos, {exclude: 'where'}) filter?: FilterExcludingWhere<Recursos>
  ): Promise<Recursos> {
    return this.recursosRepository.findById(id, filter);
  }

  @patch('/recursos/{id}', {
    responses: {
      '204': {
        description: 'Recursos PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Recursos, {partial: true}),
        },
      },
    })
    recursos: Recursos,
  ): Promise<void> {
    await this.recursosRepository.updateById(id, recursos);
  }

  @put('/recursos/{id}', {
    responses: {
      '204': {
        description: 'Recursos PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() recursos: Recursos,
  ): Promise<void> {
    await this.recursosRepository.replaceById(id, recursos);
  }

  @del('/recursos/{id}', {
    responses: {
      '204': {
        description: 'Recursos DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.recursosRepository.deleteById(id);
  }
}
