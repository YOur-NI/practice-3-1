// В файле src/wishlist.ts реализуйте класс Wishlist.

// Требования к классу:

// Поле: private favoriteIds: string[] = []. Хранит только идентификаторы книг, а не сами объекты.
// Метод toggle(id: string): void — если id уже есть в массиве, удаляет его. Если нет — добавляет в конец массива.
// Метод has(id: string): boolean — возвращает true, если книга находится в избранном.
// Метод getFavorites(catalog: BookCatalog): Book[] — принимает экземпляр BookCatalog как параметр, 
// берёт из него все книги и возвращает только те, чьи id есть в this.favoriteIds. 
// Каталог здесь — зависимость: он не хранится в полях класса, а приходит на время выполнения операции. 
// Это пример внедрения зависимости через параметр.

import type { Book } from './task1-types';
import { BookCatalog } from './task6-classes';

export class Wishlist {
  private favoriteIds: string[] = [];

  constructor(ids: string[] = []) {
    this.favoriteIds = ids;
  }

  toggle(id: string): void {
    if (this.has(id)) {
      this.favoriteIds = this.favoriteIds.filter((favId) => favId !== id);
    } else {
      this.favoriteIds = [...this.favoriteIds, id];
    }
  }

  has(id: string): boolean {
    return this.favoriteIds.includes(id);
  }

  get count(): number {
    return this.favoriteIds.length;
  }

  getFavorites(catalog: BookCatalog): Book[] {
    const allBooks = catalog.getBooks();
    return allBooks.filter(book => this.favoriteIds.includes(book.id));
  }

  getIds(): string[] {
    return [...this.favoriteIds];
  }
}