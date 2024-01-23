using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers;

public class PageList<T> : List<T>
{
    public PageList(List<T> items, int count, int pageNumber, int pageSize)
    {
        MetaData = new MetaData
        {
            TotalCount = count,
            PageSize = pageSize,
            TotalPages = (int) Math.Ceiling(count / (double) pageSize),
            CurrentPage = pageNumber,
        };
        AddRange(items);
    }

    public MetaData MetaData { get; set; }
    
    public static async Task<PageList<T>> ToPageList(IQueryable<T> query, int pageNumber, int pageSize)
    {
        var count = await query.CountAsync();
        var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        return new PageList<T>(items, count, pageNumber, pageSize);
    }
}