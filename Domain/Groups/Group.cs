using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Groups
{
    public class Group
    {
        public Guid Id { get; set; }
        public String Name { get; set; }
        public Boolean IsRemoved { get; set; }

        public Group(Guid id, String name, Boolean isRemoved)
        {
            Id = id;
            Name = name;
            IsRemoved = isRemoved;
        }
    }
}
