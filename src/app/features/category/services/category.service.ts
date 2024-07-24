import { Injectable } from '@angular/core';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Category } from '../models/get-category-response.model';
import { environment } from 'src/environments/environment.development';
import { UpdateCategoryRequest } from '../models/update-category-request.model';
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient, private cookieService: CookieService) 
{}

  addCategory(model: AddCategoryRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/api/category?addAuth=true`,model);
  }

  getAllCategories(query?: string, 
    sortBy?: string, 
    sortDirection?: string,
    pageNumber?: number,
    pageSize?: number): Observable<Category[]> {
    let params = new HttpParams();
    if(query){
      params = params.set('query', query);
    }

    if(sortBy){
      params = params.set('sortBy', sortBy);
    }

    if(sortDirection){
      params = params.set('sortDirection', sortDirection);
    }

    if(pageNumber){
      params = params.set('pageNumber', pageNumber);
    }

    if(pageSize){
      params = params.set('pageSize', pageSize);
    }

    return this.http.get<Category[]>(`${environment.apiBaseUrl}/api/category`, {
      params: params
    });
  }

  getCategoryById(id:string | null): Observable<Category> {
    return this.http.get<Category>(`${environment.apiBaseUrl}/api/category/${id}`)
  }

  updateCategory(id: string | null, updateCategoryRequest: UpdateCategoryRequest) : Observable<Category> {
      return this.http.put<Category>(`${environment.apiBaseUrl}/api/category/${id}?addAuth=true`, updateCategoryRequest);
  }

  deleteCategory(id: string | null) : Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/api/category/${id}?addAuth=true`);
    }

  getTotalCount(): Observable<number>{
    return this.http.get<number>(`${environment.apiBaseUrl}/api/category/count`)
  }

  getTotalCountFiltered(query?: string): Observable<number>{

    let params = new HttpParams();
    if(query){
      params = params.set('query', query);
    }

    return this.http.get<number>(`${environment.apiBaseUrl}/api/category/count`, {
      params: params
    })
  }

}
