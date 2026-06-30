using System;

namespace MyProject.Authors;

[Serializable]
public class AuthorExcelDownloadTokenCacheItem
{
    public string Token { get; set; } = string.Empty;
}
