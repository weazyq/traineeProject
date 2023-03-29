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
        public Group[] GetGroups(String? queryString);
        public Group[] GetGroups(Guid[] id);
        public Result RemoveGroup(Guid id);
    }
}
