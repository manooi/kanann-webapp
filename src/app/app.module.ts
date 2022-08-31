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
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    SidebarComponent,
    PagenotFoundComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
