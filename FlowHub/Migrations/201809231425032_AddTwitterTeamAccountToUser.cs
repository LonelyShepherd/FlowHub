namespace FlowHub.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddTwitterTeamAccountToUser : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.TwitterTeamAccounts",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AccountId = c.String(),
                        AccountName = c.String(),
                        account_access_token = c.String(),
                        account_access_token_secret = c.String(),
                        helper_token_secret = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.AspNetUsers", "twitterTeamAccountId", c => c.Int(nullable: false));
            CreateIndex("dbo.AspNetUsers", "twitterTeamAccountId");
            AddForeignKey("dbo.AspNetUsers", "twitterTeamAccountId", "dbo.TwitterTeamAccounts", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUsers", "twitterTeamAccountId", "dbo.TwitterTeamAccounts");
            DropIndex("dbo.AspNetUsers", new[] { "twitterTeamAccountId" });
            DropColumn("dbo.AspNetUsers", "twitterTeamAccountId");
            DropTable("dbo.TwitterTeamAccounts");
        }
    }
}
