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
import {Categorias} from '../models';
import {CategoriasRepository} from '../repositories';
import {RequestCategorias} from '../types';

export class CategoriasController {
  constructor(
    @repository(CategoriasRepository)
    public categoriasRepository : CategoriasRepository,
  ) {}

  @post('/categorias', {
    responses: {
      '200': {
        description: 'Categorias model instance',
        content: {'application/json': {schema: getModelSchemaRef(Categorias)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type:'object',
            required:['nombre','id'],
            properties:{
              'nombre':{type:"string"},
              "descripcion":{type:"string"},
              "id" :{type:'array',items:{type:"string"}}
            }
          },
        },
      },
    })
    categorias: RequestCategorias,
  ): Promise<Categorias> {
     const categoriaCreated = await this.categoriasRepository
       .create(new Categorias({nombre:categorias.nombre, descripcion:categorias.descripcion,subcategorias:categorias.id}));

      return categoriaCreated;
  }

  @get('/categorias/count', {
    responses: {
      '200': {
        description: 'Categorias model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Categorias) where?: Where<Categorias>,
  ): Promise<Count> {
    return this.categoriasRepository.count(where);
  }

  @get('/categorias', {
    responses: {
      '200': {
        description: 'Array of Categorias model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Categorias, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Categorias) filter?: Filter<Categorias>,
  ): Promise<Categorias[]> {
    return this.categoriasRepository.find(filter);
  }

  @patch('/categorias', {
    responses: {
      '200': {
        description: 'Categorias PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Categorias, {partial: true}),
        },
      },
    })
    categorias: Categorias,
    @param.where(Categorias) where?: Where<Categorias>,
  ): Promise<Count> {
    return this.categoriasRepository.updateAll(categorias, where);
  }

  @get('/categorias/{id}', {
    responses: {
      '200': {
        description: 'Categorias model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Categorias, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Categorias, {exclude: 'where'}) filter?: FilterExcludingWhere<Categorias>
  ): Promise<Categorias> {
    return this.categoriasRepository.findById(id, filter);
  }

  @patch('/categorias/{id}', {
    responses: {
      '204': {
        description: 'Categorias PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Categorias, {partial: true}),
        },
      },
    })
    categorias: Categorias,
  ): Promise<void> {
    await this.categoriasRepository.updateById(id, categorias);
  }

  @put('/categorias/{id}', {
    responses: {
      '204': {
        description: 'Categorias PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() categorias: Categorias,
  ): Promise<void> {
    await this.categoriasRepository.replaceById(id, categorias);
  }

  @del('/categorias/{id}', {
    responses: {
      '204': {
        description: 'Categorias DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.categoriasRepository.deleteById(id);
  }
}
