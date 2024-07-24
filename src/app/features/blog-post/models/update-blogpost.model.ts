import { Category } from "../../category/models/get-category-response.model";

export interface UpdateBlogPost {
    title:string;
    shortDescription:string;
    content:string;
    featuredImageUrl: string;
    urlHandle:string;
    author:string;
    publishDate:Date;
    isVisible:boolean;
    categories?: string[]
}