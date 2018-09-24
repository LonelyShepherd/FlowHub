namespace FlowHub.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddTwitterUserAccountToUser : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.TwitterUserAccounts",
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
            
            AddColumn("dbo.AspNetUsers", "twitterUserAccountId", c => c.Int(nullable: false));
            CreateIndex("dbo.AspNetUsers", "twitterUserAccountId");
            AddForeignKey("dbo.AspNetUsers", "twitterUserAccountId", "dbo.TwitterUserAccounts", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUsers", "twitterUserAccountId", "dbo.TwitterUserAccounts");
            DropIndex("dbo.AspNetUsers", new[] { "twitterUserAccountId" });
            DropColumn("dbo.AspNetUsers", "twitterUserAccountId");
            DropTable("dbo.TwitterUserAccounts");
        }
    }
}
