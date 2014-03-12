using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web.Http;
using MartinezMediaDemos.Models;
using Ploeh.AutoFixture;

namespace MartinezMediaDemos.Controllers
{
    public class UserAddressesController : ApiController
    {
        #region public

        public void Delete(int id) { }

        public IEnumerable<UserAddress> Get()
        {
            var fixture = new Fixture();

            var randomNumberGenerator = new Random((int) DateTime.Now.Ticks);
            var numberOfAddresses = randomNumberGenerator.Next(1, 100);

            var addresses = fixture.CreateMany<UserAddress>(numberOfAddresses);

            return addresses;
        }

        public IEnumerable<UserAddress> Get(Guid id)
        {
            var fixture = new Fixture();

            var randomNumberGenerator = new Random((int) DateTime.Now.Ticks);
            var delay = randomNumberGenerator.Next(5, 20) * 1000;

            Thread.Sleep(delay);

            var numberOfAddresses = randomNumberGenerator.Next(1, 100);

            var addresses = fixture.CreateMany<UserAddress>(numberOfAddresses).Select(address =>
            {
                address.UserId = id;
                return address;
            });

            return addresses;
        }

        #endregion
    }
}