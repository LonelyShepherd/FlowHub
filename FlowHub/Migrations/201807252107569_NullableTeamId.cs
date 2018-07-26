namespace FlowHub.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NullableTeamId : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.AspNetUsers", "TeamId", "dbo.Teams");
            DropIndex("dbo.AspNetUsers", new[] { "TeamId" });
            AlterColumn("dbo.AspNetUsers", "TeamId", c => c.Int());
            CreateIndex("dbo.AspNetUsers", "TeamId");
            AddForeignKey("dbo.AspNetUsers", "TeamId", "dbo.Teams", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUsers", "TeamId", "dbo.Teams");
            DropIndex("dbo.AspNetUsers", new[] { "TeamId" });
            AlterColumn("dbo.AspNetUsers", "TeamId", c => c.Int(nullable: false));
            CreateIndex("dbo.AspNetUsers", "TeamId");
            AddForeignKey("dbo.AspNetUsers", "TeamId", "dbo.Teams", "Id", cascadeDelete: true);
        }
    }
}
