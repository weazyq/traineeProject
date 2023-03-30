using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Groups
{
    public class GroupBlank
    {
        public Guid? Id { get; set; }
        public String? Name { get; set; }
        public Boolean? IsRemoved { get; set; }
    }
}
