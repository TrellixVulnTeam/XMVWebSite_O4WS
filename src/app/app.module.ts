import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { XmvCompanyComponent } from './xmv-company/xmv-company.component';
import { XMVCompanyContactComponent } from './xmv-company/xmvcompany-contact/xmvcompany-contact.component';
import { XMVCompanyOfferComponent } from './xmv-company/xmvcompany-offer/xmvcompany-offer.component';
import { XMVCompanyProfileComponent } from './xmv-company/xmvcompany-profile/xmvcompany-profile.component';
import { RespondContactComponent } from './Special-Services/Respond-Contact.component';
import { LoginComponent } from './Login/login.component';
import { Event27AugComponent}  from './Special-Services/Event-27AUG2022.component';
import { Event02JULComponent}  from './Special-Services/Event-02JUL2022.component';
import { WeddingPhotosComponent}  from './Special-Services/WeddingPhotos.component';
import { GetImagesComponent}  from './Special-Services/GetImages.component';
import { AdminJsonComponent}  from './Special-Services/AdminJson.component';

@NgModule({
  declarations: [
    AppComponent,
    XmvCompanyComponent,
    XMVCompanyContactComponent,
    XMVCompanyOfferComponent,
    XMVCompanyProfileComponent,
    RespondContactComponent,
    LoginComponent,
    Event27AugComponent,
    Event02JULComponent,
    WeddingPhotosComponent,
    GetImagesComponent,
   AdminJsonComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
