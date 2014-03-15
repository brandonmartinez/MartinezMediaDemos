using System.Collections.Generic;

namespace MartinezMediaDemos.Models
{
    public class SampleCommandSet
    {
        #region Properties

        public string Name { get; set; }

        public List<SampleCommand> Commands { get; set; }

        #endregion

        #region Constructors

        public SampleCommandSet()
        {
            Commands = new List<SampleCommand>();
        }

        #endregion
    }
}