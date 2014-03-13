using System;
using System.Collections.Generic;
using System.Web.Http;
using FizzWare.NBuilder;
using MartinezMediaDemos.Models;

namespace MartinezMediaDemos.Controllers
{
    public class SampleCommandsController : ApiController
    {
        #region public

        public void Delete(int id) { }

        public IEnumerable<SampleCommand> Get()
        {
            var randomNumberGenerator = new Random((int) DateTime.Now.Ticks);
            var numberOfSampleCommands = randomNumberGenerator.Next(1, 1000);

            return Builder<SampleCommand>.CreateListOfSize(numberOfSampleCommands).All().With(s =>
            {
                s.Id = Guid.NewGuid();
                s.GeneratedAt = DateTime.Now;
                s.ProcessedAt = null;
                s.SentAt = null;
                return s;
            }).Build();
        }

        #endregion
    }
}