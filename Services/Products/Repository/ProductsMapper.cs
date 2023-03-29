using Domain.Products;
using Npgsql;
using Services.Products.Repository.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Services.Products.Repository
{
    public static class ProductsMapper
    {
        public static ProductDb ToProductDb(this NpgsqlDataReader reader)
        {
            ProductDb productDb = new ProductDb
            {
                Id = reader.GetGuid(0),
                Name = reader.GetString(1),
                Category = reader.GetInt32(2),
                Description = reader.GetString(3),
                IsSale = reader.GetBoolean(4),
                Price = reader.GetDecimal(5),
                IsRemoved = reader.GetBoolean(6),
                GroupId = reader.GetGuid(9),
            };

            return productDb;
        }

        public static Product ToProduct(this ProductDb productDb)
        {
            Product product = new Product(
                productDb.Id, 
                productDb.Name, 
                (ProductCategory)productDb.Category, 
                productDb.GroupId, 
                productDb.Description, 
                productDb.IsSale, 
                productDb.Price, 
                productDb.IsRemoved);

            return product;
        } 
    }
}
