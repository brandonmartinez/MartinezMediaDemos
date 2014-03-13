using System;

namespace MartinezMediaDemos.Models
{
    public class SampleCommandResult
    {
        #region Properties

        public string AdditionalInformation { get; set; }

        public DateTime ProcessedAt { get; set; }

        public bool Success { get; set; }

        #endregion
    }
}