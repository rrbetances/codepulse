using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CodePulse.Data
{
    public class AuthDbContext : IdentityDbContext
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            var readerRoleId = "43fe271c-cf34-4bdf-9753-4dcedead57be";
            var writerRoleId = "857e9ce3-7528-4586-af82-0e373a707cf2";

            //Create reader an writer roles
            var roles = new List<IdentityRole>
            {
                new IdentityRole{
                    Id = readerRoleId,
                    Name = "Reader",
                    NormalizedName = "reader".ToUpper(),
                    ConcurrencyStamp = readerRoleId,
                },

                new IdentityRole{
                    Id = writerRoleId,
                    Name = "Writer",
                    NormalizedName = "writer".ToUpper(),
                    ConcurrencyStamp = writerRoleId,
                },

            };

            //seed the roles
            builder.Entity<IdentityRole>().HasData(roles);


            var adminUserId = "9970a9ea-aaef-4940-b4fc-47a8783580b0";

            var adminUser = new IdentityUser
            {
                Id = adminUserId,
                UserName = "admin@codepulse.com",
                Email = "admin@codepulse.com",
                NormalizedEmail = "admin@codepulse.com".ToUpper(),
                NormalizedUserName = "admin@codepulse.com".ToUpper(),
            };

            adminUser.PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(adminUser, "Admin@123");


            builder.Entity<IdentityUser>().HasData(adminUser);

            var adminRoles = new List<IdentityUserRole<string>> {
                new()
                { 
                    UserId = adminUserId,
                    RoleId = readerRoleId,
                },
                new()
                {
                    UserId = adminUserId,
                    RoleId = writerRoleId
                }
            };

            builder.Entity<IdentityUserRole<string>>().HasData(adminRoles);

            var publicUserId = "e9dc53e8-0d3c-4169-88ed-a954d54676b4";

            var publicUser = new IdentityUser
            {
                Id = publicUserId,
                UserName = "public@codepulse.com",
                Email = "public@codepulse.com",
                NormalizedEmail = "public@codepulse.com".ToUpper(),
                NormalizedUserName = "public@codepulse.com".ToUpper(),
            };

            publicUser.PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(adminUser, "Public@123");

            builder.Entity<IdentityUser>().HasData(publicUser);

            var publicUserRoles = new List<IdentityUserRole<string>> 
            {
                new()
                {
                    RoleId = readerRoleId,
                    UserId = publicUserId
                }
            };

            builder.Entity<IdentityUserRole<string>>().HasData(publicUserRoles);




        }
    }
}
