using CodePulse.Data;
using CodePulse.Models.Domain;
using CodePulse.Repositories.Inteface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CodePulse.Repositories.Implementation
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext dbContext;

        public CategoryRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Category> CreateAsync(Category category)
        {
            await dbContext.Categories.AddAsync(category);

            await dbContext.SaveChangesAsync();

            return category;
        }

        public async Task DeleteAsync(Category category)
        {
            dbContext.Categories.Remove(category);

            await dbContext.SaveChangesAsync();
        }

        public async Task<List<Category>> GetAllAsync(string? query = null,
            string? sortBy = null, string? sortDirection = null,
            int? pageNumber = 1, int? pageSize = 100)
        {
            var categories = dbContext.Categories.AsQueryable();

            //Filtering
            if (!string.IsNullOrWhiteSpace(query))
            {
                categories = categories.Where(x => x.Name.ToUpper().Contains(query.ToUpper()));
            }

            //Sorting
            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                switch (sortBy.ToUpper())
                {
                    case "NAME":
                        var isAsc = string.Equals(sortDirection, "asc", StringComparison.CurrentCultureIgnoreCase);
                        categories = isAsc ? categories.OrderBy(x => x.Name) : categories.OrderByDescending(x => x.Name);
                        break;

                    case "URL":
                        isAsc = string.Equals(sortDirection, "asc", StringComparison.CurrentCultureIgnoreCase);
                        categories = isAsc ? categories.OrderBy(x => x.UrlHandle) : categories.OrderByDescending(x => x.UrlHandle);
                        break;

                }

            }

            //Pagination
            var skipResults = (pageNumber - 1) * pageSize;

            categories = categories.Skip(skipResults ?? 0).Take(pageSize ?? 100);

            return await categories.ToListAsync();
        }

        public async Task<Category?> GetByIdAsync(Guid id)
        {
            return await dbContext.Categories.FindAsync(id);
        }

        public async Task<int> GetTotalCount(string? query)
        {
            var categories = dbContext.Categories.AsQueryable();

            //Filtering
            if (!string.IsNullOrWhiteSpace(query))
            {
                categories = categories.Where(x => x.Name.ToUpper().Contains(query.ToUpper()));
            }

            return await categories.CountAsync();
        }

        public async Task<Category?> UpdateAsync(Category category)
        {
            var categoryDb = await dbContext.Categories.FindAsync(category.Id);

            if (categoryDb != null)
            {
                dbContext.Entry(categoryDb).CurrentValues.SetValues(category);
                await dbContext.SaveChangesAsync();

                return category;
            }
            return null;
        }
    }
}
