namespace FlowHub.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddFacebookUserAccountToUser : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FacebookUserAccounts",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AccountId = c.String(),
                        AccountName = c.String(),
                        account_access_token = c.String(),
                        helper_access_token = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.AspNetUsers", "FbUserAccountId", c => c.Int(nullable: false));
            CreateIndex("dbo.AspNetUsers", "FbUserAccountId");
            AddForeignKey("dbo.AspNetUsers", "FbUserAccountId", "dbo.FacebookUserAccounts", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUsers", "FbUserAccountId", "dbo.FacebookUserAccounts");
            DropIndex("dbo.AspNetUsers", new[] { "FbUserAccountId" });
            DropColumn("dbo.AspNetUsers", "FbUserAccountId");
            DropTable("dbo.FacebookUserAccounts");
        }
    }
}
