import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogPostService } from '../../blog-post/services/blog-post.service';
import { Observable } from 'rxjs';
import { BlogPost } from '../../blog-post/models/blog-post.model';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent implements OnInit {

  url:string | null = null;
  blogpost$?: Observable<BlogPost>;

  constructor(private route: ActivatedRoute, private blogpostService: BlogPostService){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.url = params.get('url');
    })

    if(this.url){
      this.blogpost$ = this.blogpostService.getBlogpostByUrlHandle(this.url);
    }
  }

}
