import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  public static DEFAULT_PAGE = 0 ;
  public static  DEFAULT_SIZE = 10 ;
  constructor() { }

  changePaginationOptionsForGoToPage(page: number,size: number): string{
    return "page=" + page+"&size="+size + "&sort=id,desc";
  }

  changePaginationLimit(paginationOptions: string, size: number){
    return "size="+size;
  }

  paginationLimit(): number[]{
    return [5, 10, 25,50, 100];
  }

}
