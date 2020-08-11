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
  requestBody, RestBindings, HttpErrors,
} from '@loopback/rest';
import {Producciones} from '../models';
import {InventarioRepository, ProduccionesRepository, ProductosRepository} from '../repositories';
import * as _ from 'lodash';
import {Historial} from '../types';


export class ProduccionesController {
  constructor(
    @repository(ProduccionesRepository)
    public produccionesRepository : ProduccionesRepository,
    @repository(ProductosRepository)
    public productosRepository: ProductosRepository,
    @repository(InventarioRepository)
    public inventarioRepository : InventarioRepository
  ) {}

  @patch('/producciones/historial/{id}',{
    responses:{
      200:{
        description: 'Agregar una cantidad al historial y descontarla del inventario',
        content:{'application/json':{}}
      }
    }
  })
  async agregarHistorial(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
       'application/json': {
            schema: {type:'object',
              required:["cantidadProducida","fecha"],
              properties:{
              "cantidadProducida":{type:"number"},
              "fecha":{type:"string"}}
              },
           },
       },
       })
      historial: Historial) : Promise<Historial> {


    const receta  = await this.productosRepository.recetario(id);

    const materiasPrimasIds = _.map(receta.inventario,'id');

    const materiasPrimas = await this.inventarioRepository.find({where:{id:{inq:materiasPrimasIds}}});

    const produccion = await this.findById(historial.idProduccion);
    const actualizarInventario =[];

    // @ts-ignore
    if (historial.cantidadProducida + produccion.cantidadProducida> produccion.cantidadProducir)
      throw new HttpErrors.PreconditionRequired('La cantidad producida no puede ser mayor a la cantidad a producir');

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
      // @ts-ignore
    for (let i=0;i<receta.inventario.length;i++){
        const cantidadUtilizadaAnterior = materiasPrimas[i].cantidadUtilizada;
        const cantidadTotal = materiasPrimas[i].cantidad;

        // @ts-ignore
        const cantidadHistorial = receta.inventario[i].cantidad * historial.cantidadProducida;

        const cantidadTotalActual = cantidadUtilizadaAnterior + cantidadHistorial;


        if (cantidadTotalActual>cantidadTotal){
          throw new HttpErrors.PreconditionRequired('No hay mas materia prima');
        }

        // @ts-ignore
      actualizarInventario.push({idMateriaPrima:receta.inventario[i].id,cantidadUsada:cantidadTotalActual});
        // @ts-ignore
      produccion.materiasPrimasNecesarias[i].cantidadProducida += cantidadHistorial;

      }

    if (!Array.isArray(produccion.historial)) produccion.historial = [];

    // @ts-ignore
    produccion.historial.push({cantidadProducida:historial.cantidadProducida,fecha:historial.fecha})
    // @ts-ignore
    produccion.cantidadProducida += historial.cantidadProducida;
    // @ts-ignore
    for (const i of actualizarInventario){
      // @ts-ignore
      await this.inventarioRepository.updateById(i.idMateriaPrima, {cantidadUtilizada: i.cantidadUsada})

    }

    // @ts-ignore
    //await this.updateById(historial.idProduccion,{historial: [...produccion.historial,historial] })

    await this.updateById(historial.idProduccion,produccion)

    return historial;


  }

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

    const receta  = await this.productosRepository.recetario(producciones.productoId);

    const materiasPrimasIds = _.map(receta.inventario,'id');

    const materiasPrimas = await this.inventarioRepository.find({where:{id:{inq:materiasPrimasIds}}})

    const materiasPrimasTotales: object[] | undefined = [];

    // @ts-ignore
    receta.inventario.forEach((value, index) => {
      materiasPrimasTotales.push({
        // @ts-ignore
        materiaPrima: materiasPrimas[index].nombreMaterial,
        // @ts-ignore
        cantidadTotal: value.cantidad * producciones.cantidadProducir,
        cantidadProducida:0,
        unidadMedida: materiasPrimas[index].unidadMedida,


      })
    })

    producciones.materiasPrimasNecesarias = materiasPrimasTotales;

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
