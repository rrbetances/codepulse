using CodePulse.Models.Domain;
using CodePulse.Models.DTO;
using CodePulse.Repositories.Inteface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodePulse.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class CategoryController : ControllerBase
  {
    private readonly ICategoryRepository categoryRespository;

    public CategoryController(ICategoryRepository categoryRespository)
    {
      this.categoryRespository = categoryRespository;
    }

    [HttpPost]
    [Authorize(Roles = "Writer")]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequestDto createCategory)
    {
      var category = new Category
      {
        Name = createCategory.Name,
        UrlHandle = createCategory.UrlHandle,
      };

      await categoryRespository.CreateAsync(category);

      var response = new CategoryDto
      {
        Id = category.Id,
        Name = category.Name,
        UrlHandle = category.UrlHandle,
      };

      return Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? query, 
        [FromQuery] string? sortBy, 
        [FromQuery] string? sortDirection,
        [FromQuery] int? pageNumber,
        [FromQuery] int? pageSize)
    {
      var categories = await categoryRespository.GetAllAsync(query, sortBy, sortDirection, pageNumber, pageSize);

      var response = categories.Select(c => new CategoryDto
      {
        Name = c.Name,
        Id = c.Id,
        UrlHandle = c.UrlHandle,
      });

      return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
      var category = await categoryRespository.GetByIdAsync(id);

      if (category == null)
      {
        return NotFound();
      }

      var response = new CategoryDto
      {
        Id = category.Id,
        Name = category.Name,
        UrlHandle = category.UrlHandle,
      };

      return Ok(response);

    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Writer")]
    public async Task<IActionResult> Edit(Guid id, UpdateCategoryRequestDto request)
    {
      var category = new Category
      {
        Id = id,
        Name = request.Name,
        UrlHandle = request.UrlHandle,
      };

      category = await categoryRespository.UpdateAsync(category);

      if (category == null)
      {
        return NotFound("Category not found!");
      }

      var response = new CategoryDto
      {
        Id = category.Id,
        Name = category.Name,
        UrlHandle = category.UrlHandle,
      };

      return Ok(response);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Writer")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
      var category = await categoryRespository.GetByIdAsync(id);

      if (category == null)
      {
        return NotFound();
      }

      await categoryRespository.DeleteAsync(category);

      return Ok();
    }

        [HttpGet]
        [Route("count")]
        public async Task<IActionResult> GetCategoriesTotal([FromQuery] string? query)
        {
            var count = await categoryRespository.GetTotalCount(query);

            return Ok(count);
        }
    }
}
