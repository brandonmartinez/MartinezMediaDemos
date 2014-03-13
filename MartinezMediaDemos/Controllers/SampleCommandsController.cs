using System;
using System.Collections.Generic;
using System.Threading;
using System.Web.Http;
using FizzWare.NBuilder;
using MartinezMediaDemos.Models;

namespace MartinezMediaDemos.Controllers
{
    public class SampleCommandsController : ApiController
    {
        #region public

        public IEnumerable<SampleCommand> Get()
        {
            var randomNumberGenerator = new Random((int) DateTime.Now.Ticks);
            var numberOfSampleCommands = randomNumberGenerator.Next(1, 1000);

            var commands = Builder<SampleCommand>.CreateListOfSize(numberOfSampleCommands).All().With(s =>
            {
                s.Id = Guid.NewGuid();
                s.GeneratedAt = DateTime.UtcNow;
                s.SentAt = null;
                s.Command = (uint) randomNumberGenerator.Next(1, 10);
                return s;
            }).Build();

            fakeDelay();

            return commands;
        }

        public SampleCommandResult Post(SampleCommand sampleCommand)
        {
            var randomNumberGenerator = new Random((int) DateTime.Now.Ticks);
            var numberOfSampleCommands = randomNumberGenerator.Next(1, 100);
            var success = numberOfSampleCommands <= 80;

            var result = new SampleCommandResult
            {
                Success = success,
                ProcessedAt = DateTime.UtcNow
            };

            if(!success)
            {
                var errorMessage = numberOfSampleCommands % 5;

                switch(errorMessage)
                {
                    case 1:
                        result.AdditionalInformation = "A system error occurred.";
                        break;
                    case 2:
                        result.AdditionalInformation = "A database error occurred.";
                        break;
                    case 3:
                        result.AdditionalInformation = "What'd you break?";
                        break;
                    default:
                        result.AdditionalInformation = "An unknown error occurred; please check your server logs.";
                        break;
                }
            }

            fakeDelay();

            return result;
        }

        #endregion

        #region private

        private static void fakeDelay()
        {
            var rng = new Random((int) DateTime.Now.Ticks);
            var delay = rng.Next(1, 10) * 1000;

            Thread.Sleep(delay);
        }

        #endregion
    }
}