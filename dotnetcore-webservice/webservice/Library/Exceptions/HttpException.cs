using System;
using System.Net;


namespace webservice.Library.Exceptions
{
    public class HttpException : Exception
    {
        public HttpStatusCode status;

        public HttpException(HttpStatusCode status, string message)
            : base(message)
        {
            this.status = status;
        }
    }
}
