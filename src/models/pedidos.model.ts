import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Clientes} from './clientes.model';

@model()
export class Pedidos extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  direccion?: string;

  @property({
    type: 'string',
  })
  sector?: string;

  @property({
    type:'string',
    default:'Creado'
  })
  estado?:string

  @property({
    type: 'date',
    required: true,
  })
  fechaEntrega: string;

  @property({
    type: 'date',
    defaultFn:"now"
  })
  fechaPedido?: string;

  @property({
    type: 'number',
    default: 0,
  })
  abono?: number;

  @property({
    type: 'string',
  })
  observaciones?: string;

  @property({
    type: 'number',
  })
  precioTotal?:number


  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  productosPedidos: object[];

  @property({
    type:'string',
    required:true,
  })
  tipoEntrega:string;

  @property({
    type: 'object'
  })
  tarjeta?: object

  @property({
    type:'string'
  })
  nombreRecibe:string

  @property({
    type:'number'
  })
  numeroCelularRecibe?:number

  @property({
    type:'boolean',
    default: false
  })
  clienteRecibe?:boolean

  @property({
    type:'boolean',
    default:false
  })
  etiquetaImpresa?:boolean

  @property({
    type:'string'
  })
  asignadoAEntregadoPor?:string

  @belongsTo(() => Clientes)
  clientesId: string;

  constructor(data?: Partial<Pedidos>) {
    super(data);
  }
}

export interface PedidosRelations {
  // describe navigational properties here
}

export type PedidosWithRelations = Pedidos & PedidosRelations;
