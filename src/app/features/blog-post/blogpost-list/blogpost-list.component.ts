import { Component, OnInit, resolveForwardRef } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';
import { BlogPostService } from '../services/blog-post.service';

@Component({
  selector: 'app-blogpost-list',
  templateUrl: './blogpost-list.component.html',
  styleUrls: ['./blogpost-list.component.css']
})
export class BlogpostListComponent implements OnInit {

  blogposts$?: Observable<BlogPost[]>;

  constructor(private blogpostService: BlogPostService){}

  ngOnInit(): void {
      this.blogposts$ = this.blogpostService.getAllBlogPosts();

      this.blogposts$.subscribe(_ => {
      })
  }

}
