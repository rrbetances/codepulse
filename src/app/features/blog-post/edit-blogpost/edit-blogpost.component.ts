import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/get-category-response.model';
import { UpdateBlogPost } from '../models/update-blogpost.model';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-edit-blogpost',
  templateUrl: './edit-blogpost.component.html',
  styleUrls: ['./edit-blogpost.component.css']
})
export class EditBlogpostComponent implements OnInit, OnDestroy {

  id: string | null = null;
  routeSubscription?: Subscription
  model?: BlogPost;
  categories$?: Observable<Category[]>;
  selectedCategories?: string[];
  updateBlogpostSubscription?: Subscription;
  getBlogpostByIdSubscription?: Subscription;
  isImageSelectorVisible: boolean = false;
  imageselecteSubscription?: Subscription; 
  isImageSelectorVisibleSubscription?: Subscription;

  constructor(private route: ActivatedRoute, private blopostService: BlogPostService, 
    private categoryService: CategoryService, private router: Router, private imageService: ImageService){}
  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.updateBlogpostSubscription?.unsubscribe();
    this.getBlogpostByIdSubscription?.unsubscribe();
    this.imageselecteSubscription?.unsubscribe();
    this.isImageSelectorVisibleSubscription?.unsubscribe();
  }

  ngOnInit(): void {

    this.blopostService.isImageSelectorVisible.subscribe(response => {
      this.isImageSelectorVisible = response;
    })

    this.categories$ = this.categoryService.getAllCategories();

    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.id = params.get('id');

      if(this.id){
        this.getBlogpostByIdSubscription = this.blopostService.getBlogpostById(this.id).subscribe(response => {
          this.model = response;
          this.selectedCategories = response.categories.map(x => x.id)
        })
      }

      this.imageselecteSubscription = this.imageService.onSelectImage().subscribe(response => {
        if(this.model)
          this.model.featuredImageUrl = response.url;
      })
    })
  }

  onFormSubmit(){
    if(this.model && this.id){
      var updateBlogpost: UpdateBlogPost = {
         author: this.model.author,
         content: this.model.content,
         shortDescription: this.model.shortDescription,
         featuredImageUrl: this.model.featuredImageUrl,
         isVisible: this.model.isVisible,
         publishDate: this.model.publishDate,
         title: this.model.title,
         urlHandle: this.model.urlHandle,
         categories: this.selectedCategories ?? []
      }

      this.updateBlogpostSubscription = this.blopostService.updateBlogpost(this.id, updateBlogpost)
      .subscribe(_ => {
         this.router.navigateByUrl('/admin/blogposts')
      });
    }
  }

  onDelete(){
    if(this.id){
      this.blopostService.deleteBlogpost(this.id)
      .subscribe(_=>{
         this.router.navigateByUrl('/admin/blogposts')
      })
    }
  }

  openImageSelector(){
    this.blopostService.openSelectorModal();
  }
}
