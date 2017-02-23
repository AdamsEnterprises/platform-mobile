import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { AgmCoreModule } from 'angular2-google-maps/core';

import { LazyLoadImageModule } from 'ng2-lazyload-image';

import { MyApp } from './app.component';
import { BasePage } from '../pages/base-page/base-page';
import { HomePage } from '../pages/home/home';

import { DeploymentAddPage } from '../pages/deployment-add/deployment-add';
import { DeploymentLoginPage } from '../pages/deployment-login/deployment-login';
import { DeploymentDetailsPage } from '../pages/deployment-details/deployment-details';
import { DeploymentSettingsPage } from '../pages/deployment-settings/deployment-settings';

import { ResponseListPage } from '../pages/response-list/response-list';
import { ResponseDetailsPage } from '../pages/response-details/response-details';
import { ResponseAddPage } from '../pages/response-add/response-add';
import { ResponseMapPage } from '../pages/response-map/response-map';
import { ResponseSearchPage } from '../pages/response-search/response-search';

import { CheckboxComponent } from '../components/checkbox/checkbox';
import { CheckboxesComponent } from '../components/checkboxes/checkboxes';
import { DateComponent } from '../components/date/date';
import { DateTimeComponent } from '../components/datetime/datetime';
import { ImageComponent } from '../components/image/image';
import { LocationComponent } from '../components/location/location';
import { NumberComponent } from '../components/number/number';
import { RadioComponent } from '../components/radio/radio';
import { SelectComponent } from '../components/select/select';
import { TextComponent } from '../components/text/text';
import { TextAreaComponent } from '../components/textarea/textarea';
import { VideoComponent } from '../components/video/video';

import { CardComponent } from '../components/card/card';
import { ValueComponent } from '../components/value/value';

import { DateTimePipe } from '../pipes/date-time';
import { TimeAgoPipe } from '../pipes/time-ago';
import { TitleizePipe } from '../pipes/titleize';
import { CapitalizePipe } from '../pipes/capitalize';

import { LoggerService } from '../providers/logger-service';
import { ApiService } from '../providers/api-service';
import { DatabaseService } from '../providers/database-service';
import { VimeoService } from '../providers/vimeo-service';

import { VIMEO_ACCESS_TOKEN } from '../helpers/constants';

export function provideStorage() {
  return new Storage(['sqlite', 'websql', 'indexeddb'], { name: 'ushahidi' });
}

@NgModule({
  declarations: [
    MyApp,
    BasePage,
    HomePage,
    DeploymentAddPage,
    DeploymentLoginPage,
    DeploymentDetailsPage,
    DeploymentSettingsPage,
    ResponseListPage,
    ResponseDetailsPage,
    ResponseAddPage,
    ResponseMapPage,
    ResponseSearchPage,
    CheckboxComponent,
    CheckboxesComponent,
    DateComponent,
    DateTimeComponent,
    ImageComponent,
    LocationComponent,
    NumberComponent,
    RadioComponent,
    SelectComponent,
    TextComponent,
    TextAreaComponent,
    VideoComponent,
    CardComponent,
    ValueComponent,
    DateTimePipe,
    TimeAgoPipe,
    TitleizePipe,
    CapitalizePipe
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    FormsModule,
    ReactiveFormsModule,
    LazyLoadImageModule,
    AgmCoreModule.forRoot({
      apiKey: VIMEO_ACCESS_TOKEN
    })
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [
    MyApp,
    HomePage,
    DeploymentAddPage,
    DeploymentLoginPage,
    DeploymentDetailsPage,
    DeploymentSettingsPage,
    ResponseListPage,
    ResponseDetailsPage,
    ResponseAddPage,
    ResponseMapPage,
    ResponseSearchPage
  ],
  providers: [
    { provide: ApiService, useClass: ApiService },
    { provide: Storage, useFactory: provideStorage },
    { provide: VimeoService, useClass: VimeoService },
    { provide: LoggerService, useClass: LoggerService },
    { provide: DatabaseService, useClass: DatabaseService },
    { provide: ErrorHandler, useClass: IonicErrorHandler } ]
})
export class AppModule {}
