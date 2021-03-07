import {Entity, model, property} from '@loopback/repository';
import {Historial, MateriaPrimaNecesaria, SubproductoProduccion} from '../types';
import {Pedidos} from './pedidos.model';

@model()
export class Producciones extends Entity {
  @property({
    type: 'array',
    itemType:Pedidos,
    required: true,
  })
  pedidos: Pedidos[];

  @property({
    type: 'number',
    required: true,
  })
  cantidadTotalProducir: number;

  @property({
    type:'number',
    default:0,
  })
  cantidadTotalProducida?:number


  @property({
    type:'date',
  })
  fechaEntrega?:string

  @property({
    type: 'array',
    itemType: 'object',
  })
  historial?: Historial[];

  @property({
    type: 'array',
    itemType: 'object',
  })
  materiasPrimasNecesarias?: MateriaPrimaNecesaria[];

  @property({
    type:'array',
    itemType: 'object'
  })
  subProductosProduccion?:SubproductoProduccion[]

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;


  constructor(data?: Partial<Producciones>) {
    super(data);
  }
}

export interface ProduccionesRelations {
  // describe navigational properties here
}

export type ProduccionesWithRelations = Producciones & ProduccionesRelations;
