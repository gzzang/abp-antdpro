using System;

namespace MyProject.Books;

[Serializable]
public class BookExcelDownloadTokenCacheItem
{
    public string Token { get; set; } = string.Empty;
}
