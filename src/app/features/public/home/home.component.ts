import { Component, OnInit, resolveForwardRef } from '@angular/core';
import { BlogPostService } from '../../blog-post/services/blog-post.service';
import { Observable, Subscription } from 'rxjs';
import { BlogPost } from '../../blog-post/models/blog-post.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  blogs$?: Observable<BlogPost[]>;

  constructor(private blogpostService: BlogPostService){}

  ngOnInit(): void {
     this.blogs$ = this.blogpostService.getAllBlogPosts();
  }

}
