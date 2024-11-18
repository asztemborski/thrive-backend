namespace Thrive.Shared.Abstractions.Domain;

public abstract class AggregateRoot<T> where T : new()
{
    public T Id { get; protected set; } = new();
    
    private readonly List<IDomainEvent> _events = [];
    public IEnumerable<IDomainEvent> Events => _events;
    
    protected void AddEvent(IDomainEvent @event)
    {
        _events.Add(@event);
    }

    public void ClearEvents() => _events.Clear();
}