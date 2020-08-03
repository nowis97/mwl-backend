import {Entity, model, property} from '@loopback/repository';

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
    type: 'array',
    itemType: 'object',
    required: true
  })
  inventario?: object[]

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  constructor(data?: Partial<Recetario>) {
    super(data);
  }
}

export interface RecetarioRelations {
  // describe navigational properties here
}

export type RecetarioWithRelations = Recetario & RecetarioRelations;
