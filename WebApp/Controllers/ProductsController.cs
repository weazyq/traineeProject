using Domain.Products;
using Domain.Groups;
using Microsoft.AspNetCore.Mvc;
using Services.Products;
using Services.Products.Repository;
using Services.Groups;
using Services.Groups.Repository;
using Tools;

namespace WebApp.Controllers
{
    public class ProductsController : Controller
    {
        private IProductsService _productsService;
        private IGroupsService _groupsService;
        public ProductsController()
        {
            _productsService = new ProductsService(new ProductsRepository("Host=localhost;Username=postgres;Password=123;Database=postgres"));
            _groupsService = new GroupsService(new GroupRepository("Host=localhost;Username=postgres;Password=123;Database=postgres"));
        }

        public IActionResult Index()
        {
            Product[] products = _productsService.GetProducts();
            return View("Products", products);
        }

        [HttpGet("/products/get")]
        public Page<Product> GetProducts(Int32 pageNumber, Int32 countInPage, String? queryString)
        {
            Page<Product> products = _productsService.GetProducts(pageNumber, countInPage, queryString);

            return products;
        }

        [HttpGet("/product/get")]
        public Product GetProduct([FromQuery] Guid id)
        {
            Product product = _productsService.GetProduct(id);

            return product;
        }

        [HttpPost("/products/save")]
        public Result SaveProduct([FromBody] ProductBlank productBlank)
        {
            return _productsService.Save(productBlank);
        }

        [HttpPost("/products/remove")]
        public Result RemoveProduct([FromQuery] Guid id)
        {
            return _productsService.Remove(id);
        }

        [HttpGet("/products/groups/get-by-query")]
        public Group[] GetGroups([FromQuery] String? queryString)
        {
            Group[] groups = _groupsService.GetGroups(queryString);

            return groups;
        }

        [HttpGet("/products/groups/get")]
        public Page<Group> GetGroups(Int32 pageNumber, Int32 countInPage, String? queryString)
        {
            Page<Group> page = _groupsService.GetGroups(pageNumber, countInPage, queryString);

            return page;
        }

        [HttpPost("/products/groups/post")]
        public Group[] GetGroups([FromBody] Guid[] id)
        {
            Group[] groups = _groupsService.GetGroups(id);
            return groups;
        }

        [HttpGet("/products/group/get")]
        public Group GetGroup([FromQuery]Guid id) 
        {
            Group group = _groupsService.GetGroup(id);
            return group;
        }

        [HttpPost("/products/group/remove")]
        public Result RemoveGroup([FromQuery] Guid id)
        {
            return _groupsService.RemoveGroup(id);
        }

        [HttpPost("products/group/save")]
        public Result SaveGroup([FromBody]GroupBlank group)
        {
            return _groupsService.SaveGroup(group);
        }
    }
}
