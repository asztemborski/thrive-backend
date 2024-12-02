using FluentValidation;
using MediatR;
using Thrive.Shared.Abstractions.Exceptions;
using ValidationException = Thrive.Shared.Application.Exceptions.ValidationException;

namespace Thrive.Shared.Application.Validation;

public sealed class ValidationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehaviour(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!_validators.Any()) return await next();

        var context = new ValidationContext<TRequest>(request);

        var validationResults = await Task.WhenAll(
            _validators.Select(validator => validator.ValidateAsync(context, cancellationToken)));

        var errors = validationResults
            .Where(result => !result.IsValid)
            .SelectMany(result => result.Errors)
            .Select(failure => new ExceptionDetail(failure.ErrorCode, failure.PropertyName, failure.ErrorMessage))
            .ToList();

        if (errors.Count != 0) throw new ValidationException(errors);

        return await next();
    }
}