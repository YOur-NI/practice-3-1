import { Book } from "./task1-types";
import { filterByTitle, sortBooks } from "./task5-utils";

export class BookCatalog {
  private books: Book [];
  readonly id: string;

  constructor (id: string, books: Book[] = []){
    this.id = id;
    this.books = books;
  }

  addBook(book:Book): void {
    this.books = [...this.books, book];
  }

  removeBook (id: string): void {
    this.books = this.books.filter((book) => book.id !== id );
  }

  getBooks(): Book [] {
    return [...this.books];
  }

  sortBy(sortType: "year" | "rating"): Book[] {
    return sortBooks (this.books, sortType);
  }

  searchByTitle(query: string): Book[] {
    return this.books.filter(filterByTitle(query));
  }

  get count(): number {
    return this.books.length;
  }
}
