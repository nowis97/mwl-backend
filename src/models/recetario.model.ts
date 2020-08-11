import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Inventario} from './inventario.model';

@model()
export class Recetario extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  detalles: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;


  @property({
    type: 'array',
    itemType: 'object',
    required: false
  })
  inventario?: object[]

  constructor(data?: Partial<Recetario>) {
    super(data);
  }
}

export interface RecetarioRelations {
  // describe navigational properties here
}

export type RecetarioWithRelations = Recetario & RecetarioRelations;
