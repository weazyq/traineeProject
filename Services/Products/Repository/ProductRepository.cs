using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using Domain.Products;
using Npgsql;
using Services.Products.Repository.Models;
using Tools;


namespace Services.Products.Repository
{
    public class ProductsRepository
    {
        private readonly string _connectionString;

        public ProductsRepository(String connectionString)
        {
            _connectionString = connectionString;
        }

        public Product? GetProductById(Guid id)
        {
            Product? product = null;
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = connection;
                    cmd.Parameters.Add(new NpgsqlParameter("@id", id));
                    cmd.CommandText = @"SELECT * FROM products WHERE id = @id";

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {

                            return reader.ToProductDb().ToProduct();
                        }
                    }
                }
            }
            return product;
        }

        public Result RemoveProduct(Guid id)
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = connection;
                    cmd.Parameters.Add(new NpgsqlParameter("@id", id));
                    cmd.CommandText = @"UPDATE products SET isremoved = true where id = @id";

                    cmd.ExecuteNonQuery();
                    return Result.Success();
                }
            }
        }
        public Result SaveProduct(ProductBlank product)
        {
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                using (var cmd = new NpgsqlCommand())
                {
                    cmd.Connection = connection;
                    
                    //Если продукт добавляется, иначе используем ID существующего
                    if (product.Id == null)
                        product.Id = Guid.NewGuid();
                    
                    cmd.Parameters.AddWithValue("@id",NpgsqlTypes.NpgsqlDbType.Uuid, product.Id);
                    cmd.Parameters.AddWithValue("@name",NpgsqlTypes.NpgsqlDbType.Varchar, product.Name);
                    cmd.Parameters.AddWithValue("@category",NpgsqlTypes.NpgsqlDbType.Integer,  (Int32)product.Category);
                    cmd.Parameters.AddWithValue("@groupid",NpgsqlTypes.NpgsqlDbType.Uuid, product.GroupId);
                    cmd.Parameters.AddWithValue("@description",NpgsqlTypes.NpgsqlDbType.Varchar, product.Description);
                    cmd.Parameters.AddWithValue("@price",NpgsqlTypes.NpgsqlDbType.Numeric, product.Price);
                    cmd.Parameters.AddWithValue("@time", NpgsqlTypes.NpgsqlDbType.Timestamp, DateTime.Now);
                    
                    cmd.CommandText = @"INSERT INTO products (id, name, category, groupid, description, price, createddatetimeutc)
                                        VALUES (@id,@name,@category,@groupid,@description,@price,@time)
                                        ON CONFLICT (id) DO UPDATE SET name = @name, category = @category, groupid = @groupid, description = @description, price = @price, modifieddatetimeutc = @time";
                    
                    cmd.ExecuteNonQuery();
                    return Result.Success();
                }
            }
        }

        public Product[] GetProducts()
        {
            List<Product> products = new List<Product>();

            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                using (var command = new NpgsqlCommand())
                {
                    command.Connection = connection;
                    command.CommandText = @"SELECT * FROM products p LIMIT 10";

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            products.Add(reader.ToProductDb().ToProduct());
                        }
                    }
                }
            }
            return products.ToArray();
        }

        public Page<Product> GetProducts(Int32 pageNumber, Int32 countInPage, String? queryString)
        {
            List<Product> products = new List<Product>();

            Int64 totalRows = 0;

            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                using (var command = new NpgsqlCommand())
                {
                    command.Connection = connection;

                    command.Parameters.AddWithValue("@countInPage", countInPage);
                    command.Parameters.AddWithValue("@offset", (pageNumber - 1) * countInPage);
                    
                    command.CommandText = $"SELECT *, COUNT(*) OVER() AS totalrows FROM products p WHERE p.isremoved = false " + 
                        (String.IsNullOrEmpty(queryString) ? "" : $"AND (p.name ILIKE '%{queryString}%' OR p.description ILIKE '%{queryString}%')") +
                        "ORDER BY createddatetimeutc DESC OFFSET @offset LIMIT @countInPage";

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            totalRows = reader.GetInt64(10);
                            products.Add(reader.ToProductDb().ToProduct());
                        }
                    }
                }
            }

            Page<Product> page = new Page<Product>(products.ToArray(), totalRows);
            return page;
        }


        public Product[] GetSalesProducts(Int32[] groupIds)
        {
            List<Product> products = new List<Product>();
            using (var connection = new NpgsqlConnection(_connectionString))
            {
                connection.Open();

                using (var command = new NpgsqlCommand())
                {
                    command.Connection = connection;
                    command.CommandText = @"select * from products p
                                            where sale = true and (groupid = any(@groupIds))";

                    command.Parameters.Add(new NpgsqlParameter("@groupIds", groupIds));
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            products.Add(
                                reader.ToProductDb().ToProduct()
                            );
                        }
                    }
                }
            }
            return products.ToArray();
        }
        public Product[] GetProducts(Guid groupName, String productName)
        {

            List<Product> products = new List<Product>();

            using (var connection = new NpgsqlConnection(_connectionString))
            {

                connection.Open();

                using (var command = new NpgsqlCommand())
                {
                    command.Connection = connection;

                    command.CommandText = @"select p.""name"", g.""name"", price, issale from products p
                                            join ""group"" g on g.id  = p.groupid  
                                            where p.""name"" LIKE '%@productName%' and g.""name"" like '%@groupName%';";

                    command.Parameters.Add(new NpgsqlParameter("@groupName", groupName));
                    command.Parameters.Add(new NpgsqlParameter("@productName", productName));

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            products.Add(
                                reader.ToProductDb().ToProduct()
                            );
                        }
                    }
                }
            }
            return products.ToArray();
        }
    }
}
