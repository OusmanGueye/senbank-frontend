import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import {ShareModule} from "../share/share.module";
import {ContentComponent} from "./content/content.component";


@NgModule({
  declarations: [
    ContentComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ShareModule,
    MainRoutingModule
  ]
})
export class MainModule { }
