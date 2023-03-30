using Domain.Products;
using Services;
using Services.Products;
using Services.Products.Repository;
using System.Threading.Channels;

namespace Sheduler
{
    internal class Program
    {
        static void Main(string[] args)
        {
            IProductsService productService;
            var connectionString = "Host=localhost;Username=postgres;Password=123;Database=postgres";
            productService = new ProductsService(new ProductsRepository(connectionString));

            Boolean AppEnable = true;
            Int32 pageNumber = 1;
            Int32 pageSize = 5;

            ConsoleKeyInfo key;

            /*productService.Save(new ProductBlank
            {
                Name = "Товарчик",
                Description = "Вкусный",
                Category = (ProductCategory)1,
                GroupId = 1,
                IsSale = true,
                Price = 1000
            });*/

            Product[] products = { };
            while (AppEnable)
            {
                Console.WriteLine($"Данные / Продукты");
                Console.WriteLine($"Страница {pageNumber}\n");

                /*products = productService.GetProducts(pageNumber,pageSize);*/

                foreach (Product item in products)
                {
                    Console.Write($"{item.Name}\t| {item.GroupId}\t| {item.Description}\t| {item.Price}\n");
                }

                Console.WriteLine("\n(<--) Предыдущая страница | Следующая страница (-->)");

                key = Console.ReadKey();

                if (key.Key == ConsoleKey.RightArrow)
                {
                    Console.Clear();
                    pageNumber++;
                } else if (key.Key == ConsoleKey.LeftArrow)
                {
                    Console.Clear();
                    if (pageNumber > 1) 
                    pageNumber--;
                } else
                {
                    Console.Clear();
                }
            }
        }
    }
}