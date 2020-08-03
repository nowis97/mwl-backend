import {Entity, model, property} from '@loopback/repository';

@model()
export class Subcategoria extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
  })
  descripcion?: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;


  constructor(data?: Partial<Subcategoria>) {
    super(data);
  }
}

export interface SubcategorisRelations {
  // describe navigational properties here
}

export type SubcategorisWithRelations = Subcategoria & SubcategorisRelations;
