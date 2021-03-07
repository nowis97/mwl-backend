import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class ProductoPersonalizado extends Entity {
  @property({
    type: 'array',
    itemType:'object',
    required: false,
  })
  campos: object[];

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  productosId?: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<ProductoPersonalizado>) {
    super(data);
  }
}

export interface ProductoPersonalizadoRelations {
  // describe navigational properties here
}
