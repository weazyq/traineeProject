using Services.Products.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Products;
using Tools;

namespace Services.Products
{
    public class ProductsService : IProductsService
    {
        private readonly ProductsRepository _productsRepository;

        public ProductsService(ProductsRepository productsRepository)
        {
            _productsRepository = productsRepository;
        }
        
        public Result Save(ProductBlank productBlank)
        {
            if (String.IsNullOrWhiteSpace(productBlank.Name))
                return Result.Filed("Укажите имя");
            if (productBlank.Category is null)
                return Result.Filed("Укажите категорию");
            if (productBlank.GroupId is null)
                return Result.Filed("Укажите номер группы");
            if (String.IsNullOrEmpty(productBlank.Description))
                return Result.Filed("Укажите описание");
            if (productBlank.Price is null)
                return Result.Filed("Укажите цену");

            if(productBlank.Id is not null)
            {
                Product product =GetProduct(productBlank.Id.Value);
                if (product is null) return Result.Filed("Указанный продукт не существует");
            }

            try
            {
                _productsRepository.SaveProduct(productBlank);
                return Result.Success();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public Result Remove(Guid productId)
        {
            return _productsRepository.RemoveProduct(productId);
        }

        public Product GetProduct(Guid productId)
        {
            return _productsRepository.GetProductById(productId);
        }
        public Product[] GetProducts()
        {
            return _productsRepository.GetProducts();
        }
        public Page<Product> GetProducts(Int32 pageNumber, Int32 countInPage, String? queryString)
        {
            return _productsRepository.GetProducts(pageNumber, countInPage, queryString);
        }

        public Product[] GetProducts(Guid groupName, String productName)
        {
            return _productsRepository.GetProducts(groupName, productName);
        }
    }
}
