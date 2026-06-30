import { request } from '@umijs/max';

/** Book types enum matching backend BookType */
export enum BookType {
  Undefined = 0,
  Adventure = 1,
  Biography = 2,
  Dystopia = 3,
  Fantastic = 4,
  Horror = 5,
  Science = 6,
  ScienceFiction = 7,
  Poetry = 8,
}

export const BookTypeLabels: Record<number, string> = {
  [BookType.Undefined]: '未定义',
  [BookType.Adventure]: '冒险',
  [BookType.Biography]: '传记',
  [BookType.Dystopia]: '反乌托邦',
  [BookType.Fantastic]: '奇幻',
  [BookType.Horror]: '恐怖',
  [BookType.Science]: '科学',
  [BookType.ScienceFiction]: '科幻',
  [BookType.Poetry]: '诗歌',
};

export interface BookDto {
  id: string;
  name: string;
  authorId: string;
  authorName: string;
  type: BookType;
  publishDate: string;
  price: number;
  creationTime?: string;
  lastModificationTime?: string;
}

export interface CreateUpdateBookDto {
  name: string;
  authorId: string;
  type: BookType;
  publishDate: string;
  price: number;
}

export interface PagedResultDto<T> {
  items: T[];
  totalCount: number;
}

/** GET /api/app/book */
export async function getBookList(params: {
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}) {
  return request<PagedResultDto<BookDto>>('/api/app/book', {
    method: 'GET',
    params,
  });
}

/** GET /api/app/book/:id */
export async function getBook(id: string) {
  return request<BookDto>(`/api/app/book/${id}`, {
    method: 'GET',
  });
}

/** POST /api/app/book */
export async function createBook(data: CreateUpdateBookDto) {
  return request<BookDto>('/api/app/book', {
    method: 'POST',
    data,
  });
}

/** PUT /api/app/book/:id */
export async function updateBook(id: string, data: CreateUpdateBookDto) {
  return request<BookDto>(`/api/app/book/${id}`, {
    method: 'PUT',
    data,
  });
}

/** DELETE /api/app/book/:id */
export async function deleteBook(id: string) {
  return request<void>(`/api/app/book/${id}`, {
    method: 'DELETE',
  });
}
