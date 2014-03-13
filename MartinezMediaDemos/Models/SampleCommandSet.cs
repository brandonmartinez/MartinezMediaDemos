using System.Collections.Generic;

namespace MartinezMediaDemos.Models
{
    public class SampleCommandSet
    {
        #region Properties

        public string Name { get; set; }

        public List<SampleCommand> SampleCommands { get; set; }

        #endregion

        #region Constructors

        public SampleCommandSet()
        {
            SampleCommands = new List<SampleCommand>();
        }

        #endregion
    }
}