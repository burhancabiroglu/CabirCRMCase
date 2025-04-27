namespace CabirCRM.Application.Responses.Common;

public class SuccessResponse(string message)
{
    public bool Success => true;
    public string Message { get; set; } = message;
}