using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Thrive.Modules.Identity.Domain.Entities;

namespace Thrive.Modules.Identity.Infrastructure.Database.Configurations;

internal sealed class IdentityUserConfiguration : IEntityTypeConfiguration<IdentityUser>
{
    public void Configure(EntityTypeBuilder<IdentityUser> builder)
    {
        builder.ToTable("user");
        builder.Property(user => user.Id).HasColumnName("id");
        builder.Property(user => user.Password).HasColumnName("password");
        builder.Property(user => user.IsActive).HasColumnName("is_active");

        builder.OwnsOne(user => user.Email, userEmailBuilder =>
        {
            userEmailBuilder.OwnsOne(userEmail => userEmail.Address,
                addressBuilder =>
                {
                    addressBuilder.Property(email => email.Value).HasColumnName("email_address").IsRequired();
                });

            userEmailBuilder.Property(userEmail => userEmail.IsVerified).HasColumnName("email_verified")
                .IsRequired();
        });

        builder.OwnsOne(user => user.Username, navigationBuilder =>
        {
            navigationBuilder.Property(username => username.Value)
                .HasColumnName("username").IsRequired();
        });
    }
}