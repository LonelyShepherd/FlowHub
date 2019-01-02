using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Drawing;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace FlowHub.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit https://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    // One - to - Many
    public class ApplicationUser : IdentityUser // Many
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Surname { get; set; }
        public string Avatar { get; set; }
        public string Info { get; set; }

        public int? TeamId { get; set; }
        [ForeignKey("TeamId")]
        public virtual Team Team { get; set; }

        public int? FbUserAccountId { get; set; }
        [ForeignKey("FbUserAccountId")]
        public virtual FacebookUserAccount FbUserAccount { get; set; }

        public int? FbTeamAccountId { get; set; }
        [ForeignKey("FbTeamAccountId")]
        public virtual FacebookTeamAccount FbTeamAccount { get; set; }

        public int? twitterUserAccountId { get; set; }
        [ForeignKey("twitterUserAccountId")]
        public virtual TwitterUserAccount twitterUserAccount { get; set; }

        public int? twitterTeamAccountId { get; set; }
        [ForeignKey("twitterTeamAccountId")]
        public virtual TwitterTeamAccount twitterTeamAccount { get; set; }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<Team> Teams { get; set; }
        public DbSet<FacebookUserAccount> FacebookUserAccounts { get; set; }
        public DbSet<FacebookTeamAccount> FacebookTeamAccounts { get; set; }
        public DbSet<TwitterUserAccount> TwitterUserAccounts { get; set; }
        public DbSet<TwitterTeamAccount> TwitterTeamAccounts { get; set; }


        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    }
}