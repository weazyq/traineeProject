using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tools;

namespace Domain.Products
{
    public interface IProductsService
    {
        Result Save(ProductBlank product);
        Result Remove(Guid productId);
        Product GetProduct(Guid productId);
        Product[] GetProducts();
        Page<Product> GetProducts(Int32 pageNumber, Int32 countInPages, String? queryString);
        Product[] GetProducts(Guid groupId, String productName);
    }
}
