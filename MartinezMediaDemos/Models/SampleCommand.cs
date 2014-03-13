using System;

namespace MartinezMediaDemos.Models
{
    public class SampleCommand
    {
        #region Properties

        public uint Command { get; set; }

        public DateTime GeneratedAt { get; set; }

        public Guid Id { get; set; }

        public DateTime? ProcessedAt { get; set; }

        public DateTime? SentAt { get; set; }

        #endregion
    }
}