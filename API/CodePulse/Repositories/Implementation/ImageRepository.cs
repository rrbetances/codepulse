using CodePulse.Data;
using CodePulse.Models.Domain;
using CodePulse.Repositories.Inteface;
using Microsoft.EntityFrameworkCore;

namespace CodePulse.Repositories.Implementation
{
    public class ImageRepository : IImageRepository
    {
        private readonly IWebHostEnvironment webHostEnvironment;
        private readonly ApplicationDbContext context;
        private readonly IHttpContextAccessor contextAccessor;

        public ImageRepository(IWebHostEnvironment webHostEnvironment, 
            ApplicationDbContext dbContext, IHttpContextAccessor contextAccessor)
        {
            this.webHostEnvironment = webHostEnvironment;
            this.context = dbContext;
            this.contextAccessor = contextAccessor;
        }

        public async Task<List<BlogImage>> GetAll()
        {
            return await this.context.BlogImages.ToListAsync();
        }

        public async Task<BlogImage?> Upload(IFormFile file, BlogImage blogImage)
        {
            if (contextAccessor.HttpContext != null)
            {
                //Uploada image
                var locaPath = Path.Combine(webHostEnvironment.ContentRootPath, "Images", $"{blogImage.FileName}{blogImage.FileExtension}");
                using var stream = new FileStream(locaPath, FileMode.Create);
                await file.CopyToAsync(stream);

                //Insert in database
                //https://locahost/images/somefilename.jpg
                var httpRequest = contextAccessor.HttpContext.Request;
                var urlPath = $"{httpRequest.Scheme}://{httpRequest.Host}{httpRequest.PathBase}/Images/{blogImage.FileName}{blogImage.FileExtension}";

                blogImage.Url = urlPath;

                context.BlogImages.Add(blogImage);
                await context.SaveChangesAsync();

                return blogImage;
            }
            return null;


        }
    }
}
