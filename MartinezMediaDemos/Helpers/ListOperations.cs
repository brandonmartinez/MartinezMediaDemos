using System;
using System.Collections.Generic;
using System.Linq;

namespace MartinezMediaDemos.Helpers
{
    public static class ListOperations
    {
        #region Static Methods

        public static IEnumerable<List<T>> Partition<T>(this IList<T> source, int size)
        {
            for(var i = 0; i < Math.Ceiling(source.Count / (double) size); i++)
            {
                yield return new List<T>(source.Skip(size * i).Take(size));
            }
        }

        #endregion
    }
}