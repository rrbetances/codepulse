import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/get-category-response.model';
import { Observable, Subscription } from 'rxjs';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent implements OnInit, OnDestroy {
  model: AddBlogPost;
  categories$?: Observable<Category[]>;
  isImageSelectorVisible: boolean = false;
  imageselecteSubscription?: Subscription;
  isImageSelectorVisibleSubscription?: Subscription;

  constructor(private blogpostService: BlogPostService, 
    private router: Router, 
    private categoryService: CategoryService,
    private imageService: ImageService){
    this.model = {
      title: '',
      shortDescription:'',
      urlHandle:'',
      content:'',
      featuredImageUrl:'',
      author:'',
      isVisible: true,
      publishDate: new Date(),
      categories: []
    }
  }
  ngOnDestroy(): void {
    this.imageselecteSubscription?.unsubscribe();
    this.isImageSelectorVisibleSubscription?.unsubscribe();
  }
  ngOnInit(): void {

    this.isImageSelectorVisibleSubscription = this.blogpostService.isImageSelectorVisible.subscribe(response => {
      this.isImageSelectorVisible = response;
    })

    this.categories$ = this.categoryService.getAllCategories()

    this.imageselecteSubscription = this.imageService.onSelectImage().subscribe(response => {
      if(this.model)
        this.model.featuredImageUrl = response.url;
    })
  }

  onFormSubmit(){
    this.blogpostService.createBlogPost(this.model)
    .subscribe(response => {
      this.router.navigateByUrl('/admin/blogposts')
    });
  }

  openImageSelector(){
    this.blogpostService.openSelectorModal();
  }
}
