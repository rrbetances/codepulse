using Microsoft.AspNetCore.Identity;

namespace CodePulse.Repositories.Inteface
{
  public interface ITokenRepository
  {
    string CreateJwtToken(IdentityUser user, List<string> roles);
  }
}
