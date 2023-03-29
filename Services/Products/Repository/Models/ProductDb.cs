using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Products.Repository.Models
{
    public class ProductDb
    {
        public Guid Id { get; set; }
        public String Name { get; set; }
        public Int32 Category { get; set; }
        public Guid GroupId { get; set; }
        public String Description { get; set; }
        public Boolean IsSale { get; set; }
        public Decimal Price { get; set; }
        public Boolean IsRemoved { get; set; }

    }
}
