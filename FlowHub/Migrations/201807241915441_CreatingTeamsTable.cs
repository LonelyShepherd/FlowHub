namespace FlowHub.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreatingTeamsTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Teams",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        LeaderId = c.String(maxLength: 128),
                        Name = c.String(nullable: false),
                        Avatar = c.String(),
                        Info = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.LeaderId)
                .Index(t => t.LeaderId);
            
            AddColumn("dbo.AspNetUsers", "Team_Id", c => c.Int());
            CreateIndex("dbo.AspNetUsers", "Team_Id");
            AddForeignKey("dbo.AspNetUsers", "Team_Id", "dbo.Teams", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Teams", "LeaderId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUsers", "Team_Id", "dbo.Teams");
            DropIndex("dbo.AspNetUsers", new[] { "Team_Id" });
            DropIndex("dbo.Teams", new[] { "LeaderId" });
            DropColumn("dbo.AspNetUsers", "Team_Id");
            DropTable("dbo.Teams");
        }
    }
}
