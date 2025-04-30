namespace CabirCRM.Application.Responses.Common;

public class PaginationResponse<T>
{
    public int PageNumber { get; init; }
    public int PageSize { get; init; }
    public int TotalCount { get; init; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public IEnumerable<T> Data { get; init; } = Enumerable.Empty<T>();

    public bool HasPrevious => PageNumber > 0;
    public bool HasNext => PageNumber + 1 < TotalPages;
}