import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/get-category-response.model';
import { UpdateCategoryRequest } from '../models/update-category-request.model';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit, OnDestroy {

  id:string | null = null;
  paramsSubscription?: Subscription;
  category?: Category;
  editCategorySubscription?: Subscription
  deleteSubscription?: Subscription;

  constructor(private route: ActivatedRoute, 
    private categoryService: CategoryService, 
    private router: Router){}

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe(params => 
      {
        this.id = params.get('id');

        if(this.id)
        {
          this.categoryService.getCategoryById(this.id)
          .subscribe(response => {
            this.category = response
          })
        }
      }
    )
  }

  onFormSubmit(){
    const updateCategoryRequest: UpdateCategoryRequest = {
      name: this.category?.name ?? '',
      urlHandle: this.category?.urlHandle ?? ''
    };

    if(this.id)
    {
        this.editCategorySubscription = this.categoryService.updateCategory(this.id, updateCategoryRequest)
        .subscribe(response => {
            this.router.navigateByUrl('/admin/categories')
        });
    }

  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.editCategorySubscription?.unsubscribe();
    this.deleteSubscription?.unsubscribe();
  }

  onDelete(){
    if(this.id)
    {
      this.deleteSubscription = this.categoryService.
      deleteCategory(this.id).subscribe(_ => {
        this.router.navigateByUrl('/admin/categories')
      });
    }
  }

}
