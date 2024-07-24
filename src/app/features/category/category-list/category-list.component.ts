import { Component, OnInit } from '@angular/core';
import { Category } from '../models/get-category-response.model';
import { CategoryService } from '../services/category.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories$?: Observable<Category[]>;
  searchText?: string;
  totalCount?: number;
  list: number[] = [];
  pageNumber = 1;
  pageSize = 2;

  constructor(private categoryService: CategoryService){
  }  

  ngOnInit(): void {
    this.categoryService.getTotalCount()
    .subscribe(response => {
      this.totalCount = response;
      this.list = new Array(Math.ceil(response / this.pageSize))
      this.categories$ = this.categoryService.getAllCategories(
        undefined, 
        undefined, 
        undefined,
        this.pageNumber, 
        this.pageSize
      );
    })
  }

  onSearch(){
     this.categoryService.getTotalCountFiltered(this.searchText)
      .subscribe(response => {
        console.log(response)
        this.totalCount = response;
        this.list = new Array(Math.ceil(response / this.pageSize))
        this.categories$ = this.categoryService.getAllCategories(
          this.searchText, 
          undefined, 
          undefined,
          this.pageNumber, 
          this.pageSize
        );
      })
  }

  sort(sortBy: string, sortDirection: string){
    this.categories$ = this.categoryService.getAllCategories(
      this.searchText,
      sortBy, 
      sortDirection,
      this.pageNumber,
      this.pageSize );

  }

  getPage(pageNumber: number){
    this.pageNumber = pageNumber;
    this.categories$ = this.categoryService.getAllCategories(
      this.searchText,
      undefined, 
      undefined,
      pageNumber, 
      this.pageSize
    );
  }

  getPreviousPage(){

    if(this.pageNumber - 1 < 1){
      return;
    }

    this.pageNumber -= 1;
    this.categories$ = this.categoryService.getAllCategories(
      this.searchText,
      undefined, 
      undefined,
      this.pageNumber,
      this.pageSize
    );
  }
  
  getNextPage(){
    if(this.pageNumber + 1 > this.list.length){
      return;
    }

    this.pageNumber += 1;
    this.categories$ = this.categoryService.getAllCategories(
      this.searchText,
      undefined, 
      undefined,
      this.pageNumber,
      this.pageSize
    );
  }
}
