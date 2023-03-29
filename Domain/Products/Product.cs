
namespace Domain.Products
{
    public class Product
    {
        public Guid Id { get; }
        public String Name { get; }
        public ProductCategory Category { get; }
        public Guid GroupId { get; }
        public String Description { get; }
        public Boolean IsSale { get; }
        public Decimal Price { get; }
        public Boolean IsRemoved { get; }

        public Product(Guid id, String name, ProductCategory category, Guid groupId, String description, Boolean sale, Decimal price, Boolean isRemoved)
        {
            Id = id;
            Name = name;
            Category = category;
            GroupId = groupId;
            Description = description;
            IsSale = sale;
            Price = price;
            IsRemoved = isRemoved;
        }
         
    }
}