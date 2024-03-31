import {Component, OnInit} from '@angular/core';


declare const $: any;
declare interface Menu {
  path: string;
  title: string;
  icon: string;
  class: string;
  roles?: string[];
}

export const Menus: Menu[] = [
  { path: '/app/dashboard', title: 'Dashbaord',  icon: 'dashboard', class: '', roles: ['ROLE_ADMIN']},
  { path: '/app/liste-client', title: 'Utilisateur',  icon:'people', class: '', roles: ['ROLE_ADMIN']},
  { path: '/app/liste-compte', title: 'Compte',  icon:'account_balance', class: '', roles: ['ROLE_ADMIN']},
  { path: '/app/liste-type-compte', title: 'Type De Compte',  icon:'credit_card', class: '', roles: ['ROLE_ADMIN']},
  { path: '/app/liste-transactions', title: 'Transaction',  icon:'swap_horiz', class: '', roles: ['ROLE_ADMIN'] },
  { path: '/app/client', title: 'Mes Comptes',  icon:'account_balance', class: '', roles: ['ROLE_USER'] },
  { path: '/app/client/transaction-client', title: 'Mes Transactions',  icon:'swap_horiz', class: '', roles: ['ROLE_USER'] },
  // Add roles to other menu items if necessary
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  menuItems: Menu[] | undefined;

  constructor() { }

  ngOnInit() {
    this.menuItems = Menus.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

}
