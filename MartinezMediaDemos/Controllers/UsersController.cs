using System;
using System.Collections.Generic;
using System.Web.Http;
using MartinezMediaDemos.Models;
using Ploeh.AutoFixture;

namespace MartinezMediaDemos.Controllers
{
    public class UsersController : ApiController
    {
        #region public

        public void Delete(int id) { }

        public IEnumerable<User> Get()
        {
            var fixture = new Fixture();

            var randomNumberGenerator = new Random((int) DateTime.Now.Ticks);
            var numberOfUsers = randomNumberGenerator.Next(1, 100);

            var users = fixture.CreateMany<User>(numberOfUsers);

            return users;
        }

        public User Get(Guid id)
        {
            var fixture = new Fixture();
            var user = fixture.Create<User>();
            user.Id = id;

            return user;
        }

        #endregion
    }
}