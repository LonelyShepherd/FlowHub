namespace FlowHub.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddingTeamToApplicationUser : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "TeamId", c => c.Int(nullable: false));
            CreateIndex("dbo.AspNetUsers", "TeamId");
            AddForeignKey("dbo.AspNetUsers", "TeamId", "dbo.Teams", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUsers", "TeamId", "dbo.Teams");
            DropIndex("dbo.AspNetUsers", new[] { "TeamId" });
            DropColumn("dbo.AspNetUsers", "TeamId");
        }
    }
}
