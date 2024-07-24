import { Component, OnInit, ViewChild } from '@angular/core';
import { BlogPostService } from 'src/app/features/blog-post/services/blog-post.service';
import { ImageService } from './image.service';
import { Observable } from 'rxjs';
import { BlogImage } from './models/blog-image';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.css']
})
export class ImageSelectorComponent implements OnInit {

  constructor(private blogpostService: BlogPostService, private imageService: ImageService){}

  private file?: File;

  fileName: string = '';
  title: string = '';
  images$?: Observable<BlogImage[]>
  @ViewChild('form',{ static: false }) imageUploadForm?: NgForm;

  ngOnInit(): void {
    this.getImages();
  }

  closeImageSelector(){
    this.blogpostService.closeSelectorModal();
  }

  onFileUploadChange(event: Event): void
  {
    const element = event.currentTarget as HTMLInputElement;

    this.file = element.files?.[0]

  }
  onFormSubmit(){
    if(this.file && this.fileName !== '' && this.title !== ''){
      this.imageService.uploadImage(this.file, this.fileName, this.title)
      .subscribe(response => { 
        this.imageUploadForm?.reset;
        this.getImages();
    });
    }
  }

  onSelect(image: BlogImage){
    this.imageService.selectImage(image);
    this.closeImageSelector();
  }

  private getImages(){
    this.images$ = this.imageService.getAllImages();
  }
}
