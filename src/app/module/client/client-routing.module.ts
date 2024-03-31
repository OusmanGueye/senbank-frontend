import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClientCompteComponent} from "./client-compte/client-compte.component";

const routes: Routes = [
  {
    path: '',
    component: ClientCompteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
