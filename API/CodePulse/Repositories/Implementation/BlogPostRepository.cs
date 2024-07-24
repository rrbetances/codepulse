using CodePulse.Data;
using CodePulse.Models.Domain;
using CodePulse.Repositories.Inteface;
using Microsoft.EntityFrameworkCore;

namespace CodePulse.Repositories.Implementation
{
    public class BlogPostRepository : IBlogPostRepository
    {
        private readonly ApplicationDbContext dbContext;

        public BlogPostRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<BlogPost> CreateAsync(BlogPost blogPost)
        {
            await dbContext.BlogPosts.AddAsync(blogPost);
            await dbContext.SaveChangesAsync();

            return blogPost;
        }

        public async Task<List<BlogPost>> GetAllAsync()
        {
            return await dbContext.BlogPosts.Include(b => b.Categories).ToListAsync();
        }

        public async Task<BlogPost?> GetByIdAsync(Guid id)
        {
            return await dbContext.BlogPosts.Include(b => b.Categories).FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<BlogPost?> UpdateAsync(BlogPost blogPost)
        {
            var existingBlogPost = await dbContext.BlogPosts.Include(b => b.Categories)
                                       .FirstOrDefaultAsync(b => b.Id == blogPost.Id);

            if (existingBlogPost == null)
            {
                return null;
            }

            //Update blogpost
            dbContext.Entry(existingBlogPost).CurrentValues.SetValues(blogPost);

            //Update categories
            existingBlogPost.Categories = blogPost.Categories;

            await dbContext.SaveChangesAsync();

            return blogPost;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existsBlogpost = await dbContext.BlogPosts.FirstOrDefaultAsync(b => b.Id == id);

            if (existsBlogpost != null)
            {
                dbContext.Remove(existsBlogpost);
                await dbContext.SaveChangesAsync();

                return true;
            }

            return false;
        }

        public async Task<BlogPost?> GetByUrlHandleAsync(string urlHandle)
        {
            return await dbContext.BlogPosts.Include(b => b.Categories).FirstOrDefaultAsync(b => b.UrlHandle == urlHandle);
        }
    }
}
