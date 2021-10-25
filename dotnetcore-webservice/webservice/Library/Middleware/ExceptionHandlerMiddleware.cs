using Microsoft.AspNetCore.Http;
using System;
using System.Net;
using System.Net.Mime;
using System.Text.Json;
using System.Threading.Tasks;
using webservice.Library.Exceptions;


namespace webservice.Library.Middleware
{
    public class ExceptionHandlerMiddleware
    {
        protected readonly RequestDelegate next;

        public ExceptionHandlerMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await this.next(context);
            }
            catch (Exception ex)
            {
                HttpResponse response = context.Response;
                response.ContentType = MediaTypeNames.Application.Json;

                string content = Content(response, ex);
                
                await response.WriteAsync(content);
            }
        }

        protected string Content(HttpResponse response, Exception ex)
        {
            switch (ex)
            {
                case HttpException e:
                    response.StatusCode = (int)e.status;
                    break;
                default:
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    break;
            }

            //TODO Log the Error and return a reference to the Error Id
            return JsonSerializer.Serialize(new { message = ex.Message });
        }
    }
}
