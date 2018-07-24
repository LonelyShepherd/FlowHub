namespace FlowHub.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddAvatarAndInfoToApplicationUser : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "Avatar", c => c.String());
            AddColumn("dbo.AspNetUsers", "Info", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "Info");
            DropColumn("dbo.AspNetUsers", "Avatar");
        }
    }
}
