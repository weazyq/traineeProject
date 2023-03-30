using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tools;

namespace Domain.Groups
{
    public interface IGroupsService
    {
        public Page<Group> GetGroups(Int32 pageNumber, Int32 countInPage, String? queryString);
        public Group[] GetGroups(String? queryString);
        public Group[] GetGroups(Guid[] id);
        public Group? GetGroup(Guid id);
        public Result RemoveGroup(Guid id);
        public Result SaveGroup(GroupBlank group);

    }
}
