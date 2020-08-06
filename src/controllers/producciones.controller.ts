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
import {Producciones} from '../models';
import {ProduccionesRepository} from '../repositories';

export class ProduccionesController {
  constructor(
    @repository(ProduccionesRepository)
    public produccionesRepository : ProduccionesRepository,
  ) {}

  @post('/producciones', {
    responses: {
      '200': {
        description: 'Producciones model instance',
        content: {'application/json': {schema: getModelSchemaRef(Producciones)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Producciones, {
            title: 'NewProducciones',
            exclude: ['id'],
          }),
        },
      },
    })
    producciones: Omit<Producciones, 'id'>,
  ): Promise<Producciones> {
    producciones.fechaProduccion = Date.now().toLocaleString();


    return this.produccionesRepository.create(producciones);
  }

  @get('/producciones/count', {
    responses: {
      '200': {
        description: 'Producciones model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Producciones) where?: Where<Producciones>,
  ): Promise<Count> {
    return this.produccionesRepository.count(where);
  }

  @get('/producciones', {
    responses: {
      '200': {
        description: 'Array of Producciones model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Producciones, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Producciones) filter?: Filter<Producciones>,
  ): Promise<Producciones[]> {
    return this.produccionesRepository.find(filter);
  }

  @patch('/producciones', {
    responses: {
      '200': {
        description: 'Producciones PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Producciones, {partial: true}),
        },
      },
    })
    producciones: Producciones,
    @param.where(Producciones) where?: Where<Producciones>,
  ): Promise<Count> {
    return this.produccionesRepository.updateAll(producciones, where);
  }

  @get('/producciones/{id}', {
    responses: {
      '200': {
        description: 'Producciones model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Producciones, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Producciones, {exclude: 'where'}) filter?: FilterExcludingWhere<Producciones>
  ): Promise<Producciones> {
    return this.produccionesRepository.findById(id, filter);
  }

  @patch('/producciones/{id}', {
    responses: {
      '204': {
        description: 'Producciones PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Producciones, {partial: true}),
        },
      },
    })
    producciones: Producciones,
  ): Promise<void> {
    await this.produccionesRepository.updateById(id, producciones);
  }

  @put('/producciones/{id}', {
    responses: {
      '204': {
        description: 'Producciones PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() producciones: Producciones,
  ): Promise<void> {
    await this.produccionesRepository.replaceById(id, producciones);
  }

  @del('/producciones/{id}', {
    responses: {
      '204': {
        description: 'Producciones DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.produccionesRepository.deleteById(id);
  }
}
