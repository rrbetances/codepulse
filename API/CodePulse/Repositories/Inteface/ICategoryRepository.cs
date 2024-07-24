using CodePulse.Models.Domain;

namespace CodePulse.Repositories.Inteface
{
    public interface ICategoryRepository
    {
        Task<Category> CreateAsync(Category category);

        Task<List<Category>> GetAllAsync(string? query = null,
            string? sortBy = null,
            string? sortDirection = null,
            int? pageNumber = 1,
            int? pageSize = 100);

        Task<Category?> GetByIdAsync(Guid id);

        Task<Category?> UpdateAsync(Category category);

        Task DeleteAsync(Category category);

        Task<int> GetTotalCount(string? query);
    }
}
