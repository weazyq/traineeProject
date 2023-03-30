using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Groups;
using Domain.Products;
using Services.Groups.Repository;
using Services.Products.Repository;
using Tools;

namespace Services.Groups
{
    public class GroupsService : IGroupsService
    {
        private readonly GroupRepository _groupRepository;

        public GroupsService(GroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public Page<Group> GetGroups(Int32 pageNumber, Int32 countInPage, String? queryString)
        {
            return _groupRepository.GetGroups(pageNumber, countInPage, queryString);
        }

        public Group[] GetGroups(String? queryString)
        {
            return _groupRepository.GetGroups(queryString);
        }

        public Group[] GetGroups(Guid[] id) 
        {
            return _groupRepository.GetGroups(id);
        }

        public Result RemoveGroup(Guid id)
        {
            return _groupRepository.RemoveGroup(id);
        }
        
        public Result SaveGroup(GroupBlank groupBlank)
        {
            if (String.IsNullOrWhiteSpace(groupBlank.Name))
                return Result.Filed("Укажите имя");

            if (groupBlank.Id is not null)
            {
                Group group = GetGroup(groupBlank.Id.Value);
                if (group is null) return Result.Filed("Указаная группа не существует");
            }

            try
            {
                _groupRepository.SaveGroup(groupBlank);
                return Result.Success();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public Group? GetGroup(Guid id)
        {
            return _groupRepository.GetGroup(id);
        }
    }
}
