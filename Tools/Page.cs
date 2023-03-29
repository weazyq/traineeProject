using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tools
{
    public class Page<T>
    {
        public T[] Values { get; }
        public Int64 TotalRows { get; } 

        public Page(T[] values, Int64 totalRows)
        {
            Values = values;
            TotalRows = totalRows;
        }
    }
}
