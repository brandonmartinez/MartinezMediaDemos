using System;

namespace MartinezMediaDemos.Models
{
    public class UserAddress
    {
        #region Properties

        public string AddressLine1 { get; set; }

        public string AddressLine2 { get; set; }

        public string City { get; set; }

        public Guid Id { get; set; }

        public string State { get; set; }

        public Guid UserId { get; set; }

        #endregion
    }
}