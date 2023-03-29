namespace Domain.Products
{
    public class ProductBlank
    {
        public Guid? Id { get; set; }
        public String? Name { get; set; }
        public ProductCategory? Category { get; set; }
        public Guid? GroupId { get; set; }
        public String? Description { get; set; }
        public Boolean? IsSale { get; set; }
        public Decimal? Price { get; set; }
        public Boolean? IsRemoved { get; set; }
    }
}
