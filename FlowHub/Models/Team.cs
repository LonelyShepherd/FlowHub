using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;
using System.Linq;
using System.Web;

namespace FlowHub.Models
{
    // One - to - Many
    public class Team // One
    {
        public int Id { get; set; }

        // Manager = Leader
        public string LeaderId { get; set; }
        [ForeignKey("LeaderId")]
        public virtual ApplicationUser Leader { get; set; }

        public string Name { get; set; }
        public string Avatar { get; set; }
        public string Info { get; set; }

        public virtual ICollection<ApplicationUser> ApplicationUsers { get; set; }
    }
}