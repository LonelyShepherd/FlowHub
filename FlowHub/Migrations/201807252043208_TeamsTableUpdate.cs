namespace FlowHub.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TeamsTableUpdate : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Teams", "Name", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Teams", "Name", c => c.String(nullable: false));
        }
    }
}
