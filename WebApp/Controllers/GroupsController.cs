using Microsoft.AspNetCore.Mvc;
using Services.Groups.Repository;
using Services.Groups;
using Domain.Groups;
using Tools;
using Domain.Products;

namespace WebApp.Controllers
{
    public class GroupsController : Controller
    {
        private IGroupsService _groupsService;

        public GroupsController()
        {
            _groupsService = new GroupsService(new GroupRepository("Host=localhost;Username=postgres;Password=123;Database=postgres"));
        }


        public IActionResult Index()
        {
            Group[] groups = _groupsService.GetGroups($"{null}");
            return View("Groups", groups);
        }
        
    }
}
