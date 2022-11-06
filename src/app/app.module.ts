import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { PagenotFoundComponent } from './layout/pagenotfound/pagenotfound.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './shared/material/material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { LoadingComponent } from './components/loading/loading.component';
import { Auth401Interceptor } from './interceptors/unauthorized.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    SidebarComponent,
    PagenotFoundComponent,
    NavbarComponent,
    LoginComponent,
    HomeComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    SharedModule,
    MaterialModule,
    HttpClientModule,
    AuthModule.forRoot({
      ...environment.auth,
      httpInterceptor: {
        allowedList: [`${environment.apiUrl}/*`]
      }
    })

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Auth401Interceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
