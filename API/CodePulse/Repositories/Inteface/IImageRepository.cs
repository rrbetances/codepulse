using CodePulse.Models.Domain;

namespace CodePulse.Repositories.Inteface
{
    public interface IImageRepository
    {
        Task<BlogImage?> Upload(IFormFile file, BlogImage blogImage);

        Task<List<BlogImage>> GetAll();

    }
}