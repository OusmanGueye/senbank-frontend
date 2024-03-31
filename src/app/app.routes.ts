import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {ContentComponent} from "./main/content/content.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./config/auth-guard";


export const routes: Routes =[
  {
    path: 'app',
    component: ContentComponent,
    canActivate: [AuthGuard],
    children: [{
      path: '',
      loadChildren: () => import('./main/main.module').then(m => m.MainModule)
    }]
  },
  {
    path: '',
    component: LoginComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutesModule { }
