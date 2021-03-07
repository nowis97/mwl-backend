import {DefaultCrudRepository} from '@loopback/repository';
import {Roles, RolesRelations} from '../models';
import {MwlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class RolesRepository extends DefaultCrudRepository<
  Roles,
  typeof Roles.prototype.id,
  RolesRelations
> {
  constructor(
    @inject('datasources.mwl') dataSource: MwlDataSource,
  ) {
    super(Roles, dataSource);
  }
}
