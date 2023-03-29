using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Groups;
using Services.Groups.Repository;
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
    }
}
