import { Injectable } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { UpdateBlogPost } from '../models/update-blogpost.model';

@Injectable({
  providedIn: 'root'
})
export class BlogPostService {

  constructor(private http: HttpClient ) { }

  isImageSelectorVisible = new BehaviorSubject<boolean>(false);

  isImageSelectorVisible$ = this.isImageSelectorVisible.asObservable();

  createBlogPost(data: AddBlogPost): Observable<BlogPost>{
    return this.http.post<BlogPost>(`${environment.apiBaseUrl}/api/blogposts?addAuth=true`, data);
  }

  getAllBlogPosts(): Observable<BlogPost[]>{
    return this.http.get<BlogPost[]>(`${environment.apiBaseUrl}/api/blogposts`);
  }

  getBlogpostById(id: string): Observable<BlogPost>{
    return this.http.get<BlogPost>(`${environment.apiBaseUrl}/api/blogposts/${id}`);
  }

  updateBlogpost(id: string, blogPost: UpdateBlogPost): Observable<BlogPost>{
    return this.http.put<BlogPost>(`${environment.apiBaseUrl}/api/blogposts/${id}?addAuth=true`, blogPost);
  }

  deleteBlogpost(id: string): Observable<any>{
     return this.http.delete(`${environment.apiBaseUrl}/api/blogposts/${id}?addAuth=true`);
  }

  openSelectorModal(){
    this.isImageSelectorVisible.next(true);
  }

  closeSelectorModal(){
    this.isImageSelectorVisible.next(false);
  }

  getBlogpostByUrlHandle(urlHandle: string): Observable<BlogPost>{
    return this.http.get<BlogPost>(`${environment.apiBaseUrl}/api/blogposts/byurl/${urlHandle}`);
  }

}
