// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {RequestHandler} from 'express-serve-static-core';
import {Pedidos, ProductoPersonalizado} from './models';

export type FileUploadHandler = RequestHandler;

export interface Producto {
  nombre:string,
  descripcion?:string,
  esSubproducto:boolean,
  precio:number,
  stock:number,
  categoria:string,
  subCategoria:string,
  imagenRuta? :string,
  inventario:Array<Inventarios>,
  productoPersonalizado?:ProductoPersonalizado,
  campos?:Array<object>,
  receta:string,
  subProductos:Array<Subproducto>,
  porcentajeGanancia:number,
  costo?:number

}

export interface Inventarios {
  id:string,
  cantidad:number
}

export interface Subproducto{
  id:string,
  cantidad:number

}

export interface ProductoPedido{
  id?:string
  idProducto?:string
  cantidad?:number

}


export interface RequestCategorias {
  id?: Array<string>,
  nombre:string,
  descripcion:string
}

export  interface Historial{
  cantidadProducida:number,
  fecha:Date,
  idSubproducto:string
}

export interface MateriaPrimaNecesaria{
  materiaPrima:string,
  cantidadTotal:number,
  unidadMedida:string,
  cantidadProducida:number
}

export interface SubproductoProduccion {
  idProducto:string,
  cantidadTotal:number,
  subproductosProducir:Subproducto[],
  fechaEntrega:string,
  enProduccion:boolean,
  cantidadEnProduccion?:number
  cantidadFaltante?:number

}

export interface SubProductosEnProduccion{
  pedidos:Pedidos[],
  idsSubproductos:string[],
  idProduccion:string
}

export interface Estado {
  estado:string
}

export interface Permiso{
  recurso:string,
  permisos :string[]
}