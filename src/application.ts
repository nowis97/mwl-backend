import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence-middleware';
import {AuthenticationComponent} from '@loopback/authentication';
import {JWTAuthenticationComponent, UserServiceBindings} from '@loopback/authentication-jwt';
import {MwlDataSource} from './datasources';
import {CustomUserService} from './services/jwt-usuarios.service';
import {UsuarioRepository} from './repositories';
import {AuthorizationServiceProvider} from './services/authorization.service';
import {AuthorizationComponent, AuthorizationTags} from '@loopback/authorization';
export {ApplicationConfig};

export class MadewithloveBackendApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.static('/images',path.join(__dirname,'../uploads'));

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);
    this.component(AuthorizationComponent)
    this.dataSource(MwlDataSource,UserServiceBindings.DATASOURCE_NAME);
    this.bind(UserServiceBindings.USER_REPOSITORY).toClass(UsuarioRepository);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(CustomUserService)
    this.bind('authorizationService.authorization-service')
      .toProvider(AuthorizationServiceProvider)
      .tag(AuthorizationTags.AUTHORIZER);





  }

}
