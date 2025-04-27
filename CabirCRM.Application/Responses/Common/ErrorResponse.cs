namespace CabirCRM.Application.Responses.Common;

public class ErrorResponse(string errorMessage)
{
    public bool Success => false;
    public string ErrorMessage { get; set; } = errorMessage;
}