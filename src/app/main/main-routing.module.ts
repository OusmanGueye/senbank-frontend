import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "../module/dashboard/dashboard.component";
import {ListeCompteComponent} from "../module/liste-compte/liste-compte.component";
import {ListeClientComponent} from "../module/liste-client/liste-client.component";
import {ListeTransactionComponent} from "../module/liste-transaction/liste-transaction.component";
import {TypeCompteComponent} from "../module/type-compte/type-compte.component";
import {AdminGuard} from "../config/admin.guard";

const routes: Routes = [
  { path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'liste-client',
    component: ListeClientComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'liste-compte',
    component: ListeCompteComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'liste-transactions',
    component: ListeTransactionComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'liste-type-compte',
    component: TypeCompteComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'client',
    loadChildren: () => import('../module/client/client.module').then(m => m.ClientModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
