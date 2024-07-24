using CodePulse.Models.Domain;
using CodePulse.Models.DTO;
using CodePulse.Repositories.Inteface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePulse.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class BlogPostsController : ControllerBase
  {
    private readonly IBlogPostRepository _blogPostRepository;
    private readonly ICategoryRepository _categoryRepository;

    public BlogPostsController(IBlogPostRepository blogPostRepository, ICategoryRepository categoryRepository)
    {
      _blogPostRepository = blogPostRepository;
      this._categoryRepository = categoryRepository;
    }

    [HttpPost]
    [Authorize(Roles = "Writer")]
    public async Task<IActionResult> Create([FromBody] CreateBlogPostRequestDto request)
    {
      var blogPost = new BlogPost
      {
        Title = request.Title,
        Author = request.Author,
        Content = request.Content,
        FeaturedImageUrl = request.FeaturedImageUrl,
        IsVisible = request.IsVisible,
        PublishedDate = request.PublishDate,
        ShortDescription = request.ShortDescription,
        UrlHandle = request.UrlHandle,
        Categories = new List<Category>()
      };

      foreach (var categoryGuid in request.Categories)
      {
        var existsCategory = await _categoryRepository.GetByIdAsync(categoryGuid);

        if (existsCategory != null)
        {
          blogPost.Categories.Add(existsCategory);
        }
      }

      await _blogPostRepository.CreateAsync(blogPost);

      var response = new BlogPostDto
      {
        Id = blogPost.Id,
        Author = request.Author,
        Content = blogPost.Content,
        FeaturedImageUrl = blogPost.FeaturedImageUrl,
        IsVisible = blogPost.IsVisible,
        PublishedDate = blogPost.PublishedDate,
        ShortDescription = blogPost.ShortDescription,
        UrlHandle = blogPost.UrlHandle,
        Title = request.Title,
        Categories = blogPost.Categories.Select(c => new CategoryDto
        {
          Id = c.Id,
          Name = c.Name,
          UrlHandle = c.UrlHandle
        }).ToList()
      };

      return Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
      var blogPosts = await _blogPostRepository.GetAllAsync();

      var response = blogPosts.Select(bp =>
            new BlogPostDto
            {
              Title = bp.Title,
              Author = bp.Author,
              Content = bp.Content,
              FeaturedImageUrl = bp.FeaturedImageUrl,
              IsVisible = bp.IsVisible,
              Id = bp.Id,
              PublishedDate = bp.PublishedDate,
              ShortDescription = bp.ShortDescription,
              UrlHandle = bp.UrlHandle,
              Categories = bp.Categories.Select(c => new CategoryDto
              {
                Id = c.Id,
                Name = c.Name,
                UrlHandle = c.UrlHandle
              }).ToList()
            });

      return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById([FromRoute] Guid id)
    {
      var blogPost = await _blogPostRepository.GetByIdAsync(id);

      if (blogPost == null)
      {
        return NotFound();
      }

      var response = new BlogPostDto
      {
        Title = blogPost.Title,
        Author = blogPost.Author,
        Content = blogPost.Content,
        Categories = blogPost.Categories.Select(b => new CategoryDto
        {
          Id = b.Id,
          Name = b.Name,
          UrlHandle = b.UrlHandle
        }).ToList(),
        PublishedDate = blogPost.PublishedDate,
        ShortDescription = blogPost.ShortDescription,
        UrlHandle = blogPost.UrlHandle,
        Id = blogPost.Id,
        FeaturedImageUrl = blogPost.FeaturedImageUrl,
        IsVisible = blogPost.IsVisible,
      };

      return Ok(response);

    }

    [HttpGet("ByUrl/{urlHandle}")]
    public async Task<IActionResult> GetByUrlHandle([FromRoute] string urlHandle)
    {
      var blogPost = await _blogPostRepository.GetByUrlHandleAsync(urlHandle);

      if (blogPost == null)
      {
        return NotFound();
      }

      var response = new BlogPostDto
      {
        Title = blogPost.Title,
        Author = blogPost.Author,
        Content = blogPost.Content,
        Categories = blogPost.Categories.Select(b => new CategoryDto
        {
          Id = b.Id,
          Name = b.Name,
          UrlHandle = b.UrlHandle
        }).ToList(),
        PublishedDate = blogPost.PublishedDate,
        ShortDescription = blogPost.ShortDescription,
        UrlHandle = blogPost.UrlHandle,
        Id = blogPost.Id,
        FeaturedImageUrl = blogPost.FeaturedImageUrl,
        IsVisible = blogPost.IsVisible,
      };

      return Ok(response);

    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Writer")]
    public async Task<IActionResult> Update([FromRoute] Guid id, UpdateBlogpostRequestDto request)
    {
      var blogPost = new BlogPost
      {
        Id = id,
        Title = request.Title,
        Author = request.Author,
        Content = request.Content,
        FeaturedImageUrl = request.FeaturedImageUrl,
        IsVisible = request.IsVisible,
        PublishedDate = request.PublishDate,
        ShortDescription = request.ShortDescription,
        UrlHandle = request.UrlHandle,
        Categories = new List<Category>()
      };

      foreach (var categoryGuid in request.Categories)
      {
        var existsCategory = await _categoryRepository.GetByIdAsync(categoryGuid);

        if (existsCategory != null)
        {
          blogPost.Categories.Add(existsCategory);
        }
      }


      var updatedBlogPost = await _blogPostRepository.UpdateAsync(blogPost);

      if (updatedBlogPost == null)
      {
        return NotFound();
      }

      var response = new BlogPostDto
      {
        Title = updatedBlogPost.Title,
        Author = updatedBlogPost.Author,
        Content = updatedBlogPost.Content,
        Categories = updatedBlogPost.Categories.Select(b => new CategoryDto
        {
          Id = b.Id,
          Name = b.Name,
          UrlHandle = b.UrlHandle
        }).ToList(),
        PublishedDate = updatedBlogPost.PublishedDate,
        ShortDescription = updatedBlogPost.ShortDescription,
        UrlHandle = updatedBlogPost.UrlHandle,
        Id = updatedBlogPost.Id,
        FeaturedImageUrl = updatedBlogPost.FeaturedImageUrl,
        IsVisible = updatedBlogPost.IsVisible,
      };

      return Ok(response);

    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Writer")]
    public async Task<IActionResult> Delete(Guid id)
    {
      bool result = await _blogPostRepository.DeleteAsync(id);

      if (!result)
      {
        return NotFound();
      }

      return Ok();
    }
  }
}
