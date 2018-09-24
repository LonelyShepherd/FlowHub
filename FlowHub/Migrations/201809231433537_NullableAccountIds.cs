namespace FlowHub.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NullableAccountIds : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.AspNetUsers", "FbTeamAccountId", "dbo.FacebookTeamAccounts");
            DropForeignKey("dbo.AspNetUsers", "FbUserAccountId", "dbo.FacebookUserAccounts");
            DropForeignKey("dbo.AspNetUsers", "twitterTeamAccountId", "dbo.TwitterTeamAccounts");
            DropForeignKey("dbo.AspNetUsers", "twitterUserAccountId", "dbo.TwitterUserAccounts");
            DropIndex("dbo.AspNetUsers", new[] { "FbUserAccountId" });
            DropIndex("dbo.AspNetUsers", new[] { "FbTeamAccountId" });
            DropIndex("dbo.AspNetUsers", new[] { "twitterUserAccountId" });
            DropIndex("dbo.AspNetUsers", new[] { "twitterTeamAccountId" });
            AlterColumn("dbo.AspNetUsers", "FbUserAccountId", c => c.Int());
            AlterColumn("dbo.AspNetUsers", "FbTeamAccountId", c => c.Int());
            AlterColumn("dbo.AspNetUsers", "twitterUserAccountId", c => c.Int());
            AlterColumn("dbo.AspNetUsers", "twitterTeamAccountId", c => c.Int());
            CreateIndex("dbo.AspNetUsers", "FbUserAccountId");
            CreateIndex("dbo.AspNetUsers", "FbTeamAccountId");
            CreateIndex("dbo.AspNetUsers", "twitterUserAccountId");
            CreateIndex("dbo.AspNetUsers", "twitterTeamAccountId");
            AddForeignKey("dbo.AspNetUsers", "FbTeamAccountId", "dbo.FacebookTeamAccounts", "Id");
            AddForeignKey("dbo.AspNetUsers", "FbUserAccountId", "dbo.FacebookUserAccounts", "Id");
            AddForeignKey("dbo.AspNetUsers", "twitterTeamAccountId", "dbo.TwitterTeamAccounts", "Id");
            AddForeignKey("dbo.AspNetUsers", "twitterUserAccountId", "dbo.TwitterUserAccounts", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUsers", "twitterUserAccountId", "dbo.TwitterUserAccounts");
            DropForeignKey("dbo.AspNetUsers", "twitterTeamAccountId", "dbo.TwitterTeamAccounts");
            DropForeignKey("dbo.AspNetUsers", "FbUserAccountId", "dbo.FacebookUserAccounts");
            DropForeignKey("dbo.AspNetUsers", "FbTeamAccountId", "dbo.FacebookTeamAccounts");
            DropIndex("dbo.AspNetUsers", new[] { "twitterTeamAccountId" });
            DropIndex("dbo.AspNetUsers", new[] { "twitterUserAccountId" });
            DropIndex("dbo.AspNetUsers", new[] { "FbTeamAccountId" });
            DropIndex("dbo.AspNetUsers", new[] { "FbUserAccountId" });
            AlterColumn("dbo.AspNetUsers", "twitterTeamAccountId", c => c.Int(nullable: false));
            AlterColumn("dbo.AspNetUsers", "twitterUserAccountId", c => c.Int(nullable: false));
            AlterColumn("dbo.AspNetUsers", "FbTeamAccountId", c => c.Int(nullable: false));
            AlterColumn("dbo.AspNetUsers", "FbUserAccountId", c => c.Int(nullable: false));
            CreateIndex("dbo.AspNetUsers", "twitterTeamAccountId");
            CreateIndex("dbo.AspNetUsers", "twitterUserAccountId");
            CreateIndex("dbo.AspNetUsers", "FbTeamAccountId");
            CreateIndex("dbo.AspNetUsers", "FbUserAccountId");
            AddForeignKey("dbo.AspNetUsers", "twitterUserAccountId", "dbo.TwitterUserAccounts", "Id", cascadeDelete: true);
            AddForeignKey("dbo.AspNetUsers", "twitterTeamAccountId", "dbo.TwitterTeamAccounts", "Id", cascadeDelete: true);
            AddForeignKey("dbo.AspNetUsers", "FbUserAccountId", "dbo.FacebookUserAccounts", "Id", cascadeDelete: true);
            AddForeignKey("dbo.AspNetUsers", "FbTeamAccountId", "dbo.FacebookTeamAccounts", "Id", cascadeDelete: true);
        }
    }
}
