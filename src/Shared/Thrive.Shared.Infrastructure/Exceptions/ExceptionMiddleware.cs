﻿using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Thrive.Shared.Abstractions.Exceptions;

namespace Thrive.Shared.Infrastructure.Exceptions;

public sealed class ExceptionMiddleware
{
    private readonly IWebHostEnvironment _environment;
    private readonly JsonOptions _jsonOptions;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next, IWebHostEnvironment environment,
        IOptions<JsonOptions> jsonOptions, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _environment = environment;
        _jsonOptions = jsonOptions.Value;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            await HandleExceptionAsync(context, exception);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var response = new ExceptionResponse
        {
            Title = exception.Message,
            Source = exception.TargetSite?.DeclaringType?.Namespace ?? string.Empty
        };

        if (exception is BaseException baseException)
        {
            response.Code = baseException.Code;
            response.StatusCode = baseException.StatusCode;
            response.Details.AddRange(baseException.ExceptionDetails);
        }
        else
        {
            response.Title = "Internal server error.";
            response.StatusCode = HttpStatusCode.InternalServerError;
            _logger.LogError(exception, "Exception occurred: {Message}", exception.Message);
        }

        if (!_environment.IsDevelopment()) response.Source = string.Empty;

        context.Response.StatusCode = (int)response.StatusCode;
        context.Response.ContentType = "application/json";

        await context.Response.WriteAsync(JsonSerializer.Serialize(response, _jsonOptions.SerializerOptions));
    }
}