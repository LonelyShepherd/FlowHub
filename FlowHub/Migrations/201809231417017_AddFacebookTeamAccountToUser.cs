namespace FlowHub.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddFacebookTeamAccountToUser : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FacebookTeamAccounts",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AccountId = c.String(),
                        AccountName = c.String(),
                        account_access_token = c.String(),
                        helper_access_token = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.AspNetUsers", "FbTeamAccountId", c => c.Int(nullable: false));
            CreateIndex("dbo.AspNetUsers", "FbTeamAccountId");
            AddForeignKey("dbo.AspNetUsers", "FbTeamAccountId", "dbo.FacebookTeamAccounts", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUsers", "FbTeamAccountId", "dbo.FacebookTeamAccounts");
            DropIndex("dbo.AspNetUsers", new[] { "FbTeamAccountId" });
            DropColumn("dbo.AspNetUsers", "FbTeamAccountId");
            DropTable("dbo.FacebookTeamAccounts");
        }
    }
}
