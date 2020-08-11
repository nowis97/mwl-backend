// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {RequestHandler} from 'express-serve-static-core';
import {ProductoPersonalizado} from './models';

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
  subproductos:Array<object>

}

export interface Inventarios {
  id:string,
  cantidad:number
}



export interface RequestCategorias {
  id?: Array<string>,
  nombre:string,
  descripcion:string
}

export  interface Historial{
  cantidadProducida:number,
  fecha:string,
  idProduccion:string
}

export interface MateriaPrimaNecesaria{
  materiaPrima:string,
  cantidadTotal:number,
  unidadMedida:string,
  cantidadProducida:number
}