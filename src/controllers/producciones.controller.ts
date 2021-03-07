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
  requestBody, HttpErrors,
} from '@loopback/rest';
import {Pedidos, Producciones} from '../models';
import {InventarioRepository, PedidosRepository, ProduccionesRepository, ProductosRepository} from '../repositories';
import * as _ from 'lodash';
import {Historial, MateriaPrimaNecesaria, ProductoPedido, SubProductosEnProduccion} from '../types';
import {nextDay, toDate} from '../helpers/dates';
import {groupBy} from '../helpers/functions'



export class ProduccionesController {
  constructor(
    @repository(ProduccionesRepository)
    public produccionesRepository : ProduccionesRepository,
    @repository(ProductosRepository)
    public productosRepository: ProductosRepository,
    @repository(InventarioRepository)
    public inventarioRepository : InventarioRepository,
    @repository(PedidosRepository)
    public pedidosRepository:PedidosRepository
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

    const produccion = await this.findById(historial.idSubproducto);
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

    // @ts-ignore
    if (!Array.isArray(produccion.historial)) { // @ts-ignore
      produccion.historial = [];
    }

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
          schema: getModelSchemaRef(Pedidos)
        },
      },
    })
    pedido: Pedidos,
  ): Promise<void> {

    const filterToDateInFechaEntrega = {"where": {"and": [{"fechaEntrega": {"gte":toDate(new Date(pedido.fechaEntrega))}},{"fechaEntrega": {"lt": toDate(nextDay(new Date(pedido.fechaEntrega)))}}]} }

    const produccionFechaEntregaPedido = await this.produccionesRepository.findOne(filterToDateInFechaEntrega);

      if (!produccionFechaEntregaPedido){

        const newProduccion = new Producciones({fechaEntrega:pedido.fechaEntrega, cantidadTotalProducir: this.getCantidadSubproductos(pedido.productosPedidos),pedidos:[pedido]})
        await this.produccionesRepository.create(newProduccion);
        return;

      }


      produccionFechaEntregaPedido?.pedidos.push(pedido);

      let cantidadTotalSubproductos = 0
      if (produccionFechaEntregaPedido)
        cantidadTotalSubproductos = this.getCantidadProductosDePedidos(produccionFechaEntregaPedido?.pedidos);



      await this.produccionesRepository
        .updateById(
          produccionFechaEntregaPedido?.getId(),
          {
            pedidos: produccionFechaEntregaPedido?.pedidos,
            cantidadTotalProducir: cantidadTotalSubproductos
          }
          )


    /*

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
    await this.productosRepository.updateById(producciones.productoId,{estado:'En producción'})
    return this.produccionesRepository.create(producciones);

     */

  }

  getCantidadProductosDePedidos(pedidos: Array<Pedidos>) : number{
    let cantidadTotalSubproductosPedidos = 0;
    for (const pedido of pedidos) {
      cantidadTotalSubproductosPedidos += this.getCantidadSubproductos(pedido.productosPedidos);
    }

    return cantidadTotalSubproductosPedidos;

  }

  async getMateriasPrimas(productosPedidos:Array<ProductoPedido>): Promise<Array<MateriaPrimaNecesaria>>{

    const materiasPrimasTotales: MateriaPrimaNecesaria[] | undefined = [];

    for (const productoPedido of productosPedidos) {

      const receta  = await this.productosRepository.recetario(productoPedido.idProducto);

      if (!receta) continue;

      // @ts-ignore
      const materiasPrimasIds = receta.inventario?.map(obj => obj.id);

      const materiasPrimas = await this.inventarioRepository.find({where:{id:{inq:materiasPrimasIds}}})


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

    }
    return materiasPrimasTotales;



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

  @patch('/producciones/producir',{
    responses:{
      200: {
        description: 'Producir subproductos',
        content: {type:'object'}
      }
    }
  })async producir(@requestBody({
    content:{'application/json':{ schema: {
          type:'object',
          required:['pedidos','idsSubproductos','idProduccion'],
          properties: {
            pedidos:{
              type:'array',
              itemType: 'object'
            },
            idsSubproductos:{
              type:'array',
              itemType:'string'
            },
            idProduccion:{
              type:'string'
            }
          }
        }}}

  }) subproductosEnProduccion:SubProductosEnProduccion):Promise<object>{
    const produccion = await this.produccionesRepository.findById(subproductosEnProduccion.idProduccion);

    if (produccion.subProductosProduccion){
      let historial :Historial[];
      if (produccion.historial){
        historial = produccion.historial
      }else {
        historial = []
      }


      for (const idSubproducto of subproductosEnProduccion.idsSubproductos) {

        const idxSubProductoEncontrado = produccion.subProductosProduccion.findIndex(value => value.idProducto === idSubproducto);

        if (produccion.subProductosProduccion[idxSubProductoEncontrado]){
          produccion.subProductosProduccion[idxSubProductoEncontrado].enProduccion = true;

          const cantidadProducida = produccion.subProductosProduccion[idxSubProductoEncontrado].cantidadTotal - (produccion.subProductosProduccion[idxSubProductoEncontrado].cantidadEnProduccion ?? 0)

          produccion.subProductosProduccion[idxSubProductoEncontrado].cantidadEnProduccion = produccion.subProductosProduccion[idxSubProductoEncontrado].cantidadTotal;

          const cantidadFaltante = produccion.subProductosProduccion[idxSubProductoEncontrado].cantidadTotal - (produccion.subProductosProduccion[idxSubProductoEncontrado].cantidadEnProduccion ?? 0)

          produccion.subProductosProduccion[idxSubProductoEncontrado].cantidadFaltante = cantidadFaltante

          historial.push({idSubproducto:idSubproducto,cantidadProducida:(cantidadProducida ?? 0),fecha:new Date()})

        }


      }

      for (const pedido of subproductosEnProduccion.pedidos) {

        await this.pedidosRepository.updateById(pedido.id,{estado:'En produccion'})

        const idxPedidoEncontrado = produccion.pedidos.findIndex(obj => obj.id === pedido.id);

        if (produccion.pedidos[idxPedidoEncontrado]){
          produccion.pedidos[idxPedidoEncontrado].estado = 'En produccion'
        }

      }



      await this.produccionesRepository.updateById(subproductosEnProduccion.idProduccion,
        {subProductosProduccion:produccion.subProductosProduccion, pedidos:produccion.pedidos, historial:historial})


    }

    return {idProduccion:subproductosEnProduccion.idProduccion,idsSubproductos:subproductosEnProduccion.idsSubproductos}
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
    if (!filter?.where){
      return this.produccionesRepository.find(filter);
    }
    // eslint-disable-next-line no-prototype-builtins
    if (filter.where.hasOwnProperty('date_lte') && filter.where.hasOwnProperty('date_gte')){
      // @ts-ignore
      const filterToDateInFechaEntrega = {"where": {"and": [{"fechaEntrega": {"gte":toDate(new Date(filter.where.date_lte))}},{"fechaEntrega": {"lt": toDate(nextDay(new Date(filter.where.date_gte)))}}]} }
      // @ts-ignore
      filter.where = filterToDateInFechaEntrega["where"]
    }

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
          'application/json': {},
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Producciones, {exclude: 'where'}) filter?: FilterExcludingWhere<Producciones>
  ): Promise<object> {
    const produccion = await this.produccionesRepository.findById(id, filter);
    const productosPedidosProduccion = await this.produccionesRepository.getSubproductosaProducir(produccion);

    if (!produccion.subProductosProduccion){



     await this.produccionesRepository.updateById(id,{subProductosProduccion:productosPedidosProduccion})

    }

    if (produccion.subProductosProduccion) {

      const sumCantidadTotalActual = productosPedidosProduccion.reduce((previousValue, currentValue) => previousValue + (currentValue.cantidadTotal || 0),0)

      const sumCantidadTotalAnterior = produccion.subProductosProduccion.reduce((previousValue, currentValue) => previousValue + (currentValue.cantidadTotal || 0),0)


      if (productosPedidosProduccion.length > produccion.subProductosProduccion?.length || sumCantidadTotalAnterior !== sumCantidadTotalActual) {
        productosPedidosProduccion.forEach((value, index) => {



          value.cantidadEnProduccion = produccion.subProductosProduccion? produccion.subProductosProduccion[index]?.cantidadTotal:0
          if (!value.cantidadEnProduccion) value.cantidadEnProduccion = 0;
          if (value.cantidadTotal === (value.cantidadEnProduccion) ){
            value.enProduccion = true;
          }
        })
        await this.produccionesRepository.updateById(id, {subProductosProduccion: productosPedidosProduccion})
      }

      if (productosPedidosProduccion.length === produccion.subProductosProduccion.length || sumCantidadTotalActual === sumCantidadTotalAnterior){

        return {id:produccion.id,subProductosPedidosProduccion:(produccion.subProductosProduccion.filter(obj => obj.cantidadTotal !==0))};
      }

    }

    return {id:produccion.id,subProductosPedidosProduccion:productosPedidosProduccion.filter(obj => obj.cantidadTotal !==0)};










  }

  @patch('/producciones/{id}', {
    responses: {
      '204': {
        description: 'Producciones PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') idPedido: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pedidos, {partial: true}),
        },
      },
    })
    pedido: Pedidos,
  ): Promise<void> {
    const filterToDateInFechaEntrega = {"where": {"and": [{"fechaEntrega": {"gte":toDate(new Date(pedido.fechaEntrega))}},{"fechaEntrega": {"lt": toDate(nextDay(new Date(pedido.fechaEntrega)))}}]} }

    const produccion = (await this.produccionesRepository.findOne(filterToDateInFechaEntrega));

    const idxFound = produccion?.pedidos.findIndex(obj => obj.id === idPedido);

    pedido.id = idPedido;


    if (produccion && idxFound) {
      produccion.pedidos[idxFound] = pedido;
      produccion.cantidadTotalProducir = this.getCantidadProductosDePedidos(produccion.pedidos);
    }


    if (produccion)
      await this.produccionesRepository.updateById(produccion?.getId(), produccion);

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

   getCantidadSubproductos(productosPedidos: Array<ProductoPedido>):number{

    let cantidadTotal = 0;

     for (const productoPedido of productosPedidos) {
       // @ts-ignore
       if (productoPedido.tamanoCaja){
         // @ts-ignore
         cantidadTotal += this.getCantidadSubproductos(productoPedido.sabores)
         continue;
       }
       const propiedades = Object.keys(productoPedido);
       const keyCantidad = propiedades.find(value => {
         if (value.includes('cantidad')){
           return value
         }
       })

       // @ts-ignore
       cantidadTotal += productoPedido[keyCantidad]? productoPedido[keyCantidad] : 1;


     }

     return cantidadTotal;






   }
}
