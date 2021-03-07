import {Entity, model, property} from '@loopback/repository';

@model()
export class Recursos extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;


  constructor(data?: Partial<Recursos>) {
    super(data);
  }
}

export interface RecursosRelations {
  // describe navigational properties here
}

export type RecursosWithRelations = Recursos & RecursosRelations;
