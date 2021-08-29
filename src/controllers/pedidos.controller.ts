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
  HttpErrors
} from '@loopback/rest';
import {inject} from '@loopback/context';
import {Pedidos, Productos} from '../models';
import {PedidosRepository, ProductosRepository,UsuarioRepository} from '../repositories';
import {ProduccionesController} from './producciones.controller';
import {Estado} from '../types';


export class PedidosController {
  constructor(
    @repository(PedidosRepository)
    public pedidosRepository: PedidosRepository,
    @repository(ProductosRepository)
    public productosRepository: ProductosRepository,
    @inject('controllers.ProduccionesController')
    public produccionesController: ProduccionesController,
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository
  ) {
  }

  @post('/pedidos', {
    responses: {
      '200': {
        description: 'Pedidos model instance',
        content: {'application/json': {schema: getModelSchemaRef(Pedidos)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pedidos, {
            title: 'NewPedidos',
            exclude: ['id'],
          }),
        },
      },
    })
      pedidos: Omit<Pedidos, 'id'>,
  ): Promise<Pedidos> {
    const precioTotal = await this.getPrecioPedidos(pedidos.productosPedidos);

    const newPedido = await this.pedidosRepository.create({...pedidos,precioTotal:precioTotal});

    await this.produccionesController.create(newPedido);

    return newPedido;




  }

  @get('/pedidos/count', {
    responses: {
      '200': {
        description: 'Pedidos model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Pedidos) where?: Where<Pedidos>,
  ): Promise<Count> {
    return this.pedidosRepository.count(where);
  }

  @get('/pedidos', {
    responses: {
      '200': {
        description: 'Array of Pedidos model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Pedidos, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Pedidos) filter?: Filter<Pedidos>,
  ): Promise<Pedidos[]> {
    // @ts-ignore
    if (filter?.where?.usuario) {
      // @ts-ignore
      const user = await this.usuarioRepository.getUsuarioByEmail(filter?.where?.usuario)

      // @ts-ignore
      delete filter?.where.usuario

      // @ts-ignore
      filter?.where['asignadoAEntregadoPor'] = user?.id;
    }

    return this.pedidosRepository.find(filter);

  }

  @patch('/pedidos', {
    responses: {
      '200': {
        description: 'Pedidos PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pedidos, {partial: true}),
        },
      },
    })
      pedidos: Pedidos,
    @param.where(Pedidos) where?: Where<Pedidos>,
  ): Promise<Count> {
    return this.pedidosRepository.updateAll(pedidos, where);
  }

  @get('/pedidos/{id}', {
    responses: {
      '200': {
        description: 'Pedidos model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Pedidos, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Pedidos, {exclude: 'where'}) filter?: FilterExcludingWhere<Pedidos>
  ): Promise<Pedidos> {
    return this.pedidosRepository.findById(id, filter);
  }

  @patch('/pedidos/{id}', {
    responses: {
      '204': {
        description: 'Pedidos PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Pedidos, {partial: true}),
        },
      },
    })
      pedidos: Pedidos,
  ): Promise<void> {
    await this.pedidosRepository.updateById(id, pedidos);
  }

  @patch('pedidos/imprimir-etiquetas',{
    responses: {
      '204':{
        description:'Cambia el estado del booleano etiqueta impresa'
      }
    }
  })async imprimirEtiquetas(
    @requestBody({
      content:{
        'application/json':{
          schema:{
            type:'array',
            itemType:'string'
          }
        }
      }
    })
    ids:string[]
  ){

   await this.pedidosRepository.updateAll({etiquetaImpresa:true},{id:{inq:ids}})

  }

  @patch('/pedidos/{idRepartidor}/asignar',{
    responses :{
      204:{
        description:'Asignacion de uno o mas pedidos a un repartidor'
      }
    }
  }) async asignacionPedidos (
    @param.path.string('idRepartidor') idRepartidor:string,
    @requestBody({
      content:{
        'application/json':{
          schema:{
            type: 'array',
            itemType:'string'
          }
        }
      }
    }) idsPedidos:string[]
  ):Promise<void>{
    await this.pedidosRepository.updateAll({asignadoAEntregadoPor:idRepartidor},{id:{inq:idsPedidos}})
  }

  @patch('/pedidos/{id}/cambiar-estado',{
    responses: {
      '204':{
        description:'Cambio de estado de algun pedido'
      }
    }
  }) async cambiarEstado(
    @param.path.string('id') id: string,
    @requestBody({
      content:{
        'application/json':{
          schema: {
            type: 'object',
            properties:{
              estado: {
                type:'string',
                enum:["Creado","Empaquetando","En produccion","Entregado","Listo para entregar","Cancelado"]
              }
            },
            required: ["estado"],

          }
        }
      }
    }) objEstado:Estado
  ):Promise<void>{


    const pedido = await this.pedidosRepository.findById(id)


    if (pedido.estado === objEstado.estado){
      throw new HttpErrors.PreconditionFailed('El pedido tiene el mismo estado')
    }

    await this.pedidosRepository.updateById(id,{estado:objEstado.estado})


  }

  @put('/pedidos/{id}', {
    responses: {
      '204': {
        description: 'Pedidos PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() pedidos: Pedidos,
  ): Promise<void> {
    const precioPedidos = await this.getPrecioPedidos(pedidos.productosPedidos);
    if (!pedidos.precioTotal || (pedidos.precioTotal !== precioPedidos))
        pedidos.precioTotal = precioPedidos;

    await this.pedidosRepository.replaceById(id, pedidos);

    await this.produccionesController.updateById(id,pedidos);

  }

  @del('/pedidos/{id}', {
    responses: {
      '204': {
        description: 'Pedidos DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.pedidosRepository.deleteById(id);
  }

  @get('/pedidos/{id}/precio',{
    responses:{
      200:{
        description:'Precio total pedido',
        content:{
          'application/json':{ schema: {type:'number'}}
        }
      }
    }
  })
  async getPreciototal(@param.path.string('id') id:string):Promise<number>{

    const pedido = await this.findById(id);
    return this.getPrecioPedidos(pedido.productosPedidos)

  }

  getPrecioCelebracion(celebracion: Productos, pedido: object): number {
    let sumPrecios = 0;
    // @ts-ignore
    if (!pedido || !(pedido.tamano)) return sumPrecios;

    const camposCelebracion = celebracion.productoPersonalizado.campos as Array<object>

    // @ts-ignore
    const tamanoAlfajor = camposCelebracion.find(obj => obj.nombre === pedido.tamano);

    // @ts-ignore
    const tamanoAlfajorCantidad = tamanoAlfajor.values.find(obj => obj.id === String(pedido.cantidad))

    sumPrecios += tamanoAlfajorCantidad.precioAgregado;

    // @ts-ignore
    if (!pedido.extras) return sumPrecios;


    // @ts-ignore
    const tipoCoberturaAgregados = camposCelebracion.find(obj => obj.nombre === 'tipoCobertura');

    let sum = 0;
    // @ts-ignore
    const brillosCobertura = tipoCoberturaAgregados.values.find(obj => obj.id === 'brillos');

    // @ts-ignore
    const extras = pedido.extras as Array<object>

    for (const extra of extras) {
      if (extra) {
        if (Object.keys(extra).length < 4) return sum + sumPrecios;
      } else return sum + sumPrecios;

      // @ts-ignore
      const tipoCobertura = tipoCoberturaAgregados.values.find(obj => obj.id === extra.tipoCobertura)

      // @ts-ignore
      sum += (tipoCobertura.precioAgregado ? tipoCobertura.precioAgregado : 1) * extra.cantidadExtras;
      // @ts-ignore
      if (extra.brillos && extra.brillos.length >= 1) {
        // @ts-ignore
        sum += brillosCobertura.precioAgregado * extra.brillos.length;
      }


    }

    return sum + sumPrecios;
  }

  getPrecioPersonalizado(personalizado: Productos, pedido: object): number {
    let sum = 0;
    let sumBrillos = 0;
    if (!personalizado) return sum;

    const campos = personalizado.productoPersonalizado?.campos as Array<object>;

    // @ts-ignore
    const {coberturas} = pedido;

    if (!coberturas) return sum;
    // @ts-ignore
    const tipoCoberturaObj = campos.find(obj => obj.nombre === 'coberturas');

    // @ts-ignore
    const valuesTipoCoberturas = tipoCoberturaObj?.values as Array<object>;

    for (const tipoCobertura of valuesTipoCoberturas) {
      // @ts-ignore
      const foundCobertura = coberturas.find(obj => obj.tipoCobertura === tipoCobertura.id);
      if (foundCobertura) {
        // @ts-ignore
        sum += tipoCobertura.precioAgregado;
        // @ts-ignore
        if (foundCobertura.brillos && foundCobertura.brillos.length >= 1 && sumBrillos === 0) {
          // @ts-ignore
          sumBrillos += tipoCobertura.precioAgregado;
        }

      }

    }

    return sum + sumBrillos;
  }

  getCustomProductPrice(producto: Productos, pedido: object): number {

    let sumUnitaria = 0;
    sumUnitaria +=producto.precio?? 0 ;
    let cantidad = 1;
    const propiedadesObjetos = Object.keys(pedido);
    // eslint-disable-next-line no-prototype-builtins
    if (pedido.hasOwnProperty('idProducto') && propiedadesObjetos.length === 1) return sumUnitaria;

    const campos = producto.productoPersonalizado.campos as Array<object>;

    for (const prop of propiedadesObjetos) {
      // @ts-ignore
      const campo = campos.find(obj => obj.nombre === prop)
      if (!campo) continue;

      // @ts-ignore
      const valorSeleccionado = campo.values.find(obj => obj.id === pedido[prop]);


      // @ts-ignore
      switch (campo.tipo) {

        case "select":
          // @ts-ignore
          if (campo.permiteMultipleSeleccion) {
            // @ts-ignore
            const selecteds = pedido[prop];
            for (const selected of selecteds) {
              // @ts-ignore
              const objSeleccionado = campo.values.find(obj => obj.id === selected);
              if (objSeleccionado.precioAgregado) {
                sumUnitaria += objSeleccionado.precioAgregado;
              }

            }
            break;
          }

          if (valorSeleccionado)
            sumUnitaria += valorSeleccionado.precioAgregado ?? 0;

          break;
        case "text":
          // @ts-ignore
          if (pedido[prop].length > 0) { // @ts-ignore
            sumUnitaria += campo.precioAgregado;
          }

          break;
        case "number":
          if (prop.toLowerCase().includes('cantidad')) {
            // @ts-ignore
            cantidad = pedido[prop];
            break;
          }

          // @ts-ignore
          if (pedido[prop] > 0) { // @ts-ignore
            sumUnitaria += campo.precioAgregado;
          }

          break;

      }
    }
    return (sumUnitaria * cantidad);
  }

  async getPrecioPedidos(productosPedidos: Array<object>): Promise<number> {
    let precioTotalPedidos = 0;
    if (!productosPedidos) return precioTotalPedidos;

    for (const productoPedido of productosPedidos) {
      // @ts-ignore
      const producto = await this.productosRepository.findById(productoPedido.idProducto,{include:[{relation:'productoPersonalizado'}]});
      switch (producto.nombre) {
        case 'Personalizado':
          precioTotalPedidos += producto.precio ?? 0;
          precioTotalPedidos += this.getPrecioPersonalizado(producto, productoPedido);

          break;
        default:
          if (producto.productoPersonalizado)
            precioTotalPedidos += this.getCustomProductPrice(producto, productoPedido);
          // @ts-ignore
          if (productoPedido.cantidad) { // @ts-ignore
            precioTotalPedidos = (producto.precio ?? 0) * productoPedido.cantidad
          }else{

            precioTotalPedidos += producto.precio ?? 0
          }
          break;


      }
    }
    return precioTotalPedidos;
  }
}
