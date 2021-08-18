using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Results;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Collections.Generic;
using System.Linq;
using webservice.Controllers;
using webservice.Library;
using webservice.Models;


namespace webservice.unittest
{
    [TestClass]
    public class CRUDControllerTest
    {
        [TestMethod]
        public void GetTest()
        {
            // Mock
            var serviceMock = new Mock<ICRUDService<SalesModel>>();
            serviceMock.Setup(p => p.Read(1)).Returns(
                new List<SalesModel> {
                    new SalesModel
                    {
                        UnitsSold = 5,
                        DollarsSold = 10.50
                    }
                }.AsQueryable()
            );

            var controllerMock = new Mock<CRUDController<SalesModel>>(serviceMock.Object) { CallBase = true };

            // Test
            // Calls Get(long) which will call an IQueryable service method and then return a single result.
            var result = controllerMock.Object.Get(1) as OkObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result.Value, typeof(SingleResult<SalesModel>));

            SalesModel value = (result.Value as SingleResult<SalesModel>).Queryable.FirstOrDefault();
            Assert.AreEqual(5, value.UnitsSold);
        }
    }
}
