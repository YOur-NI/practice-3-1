// ============================================================
// Задание 5: Поиск и сортировка
// ============================================================
import { Book, BookFilter } from "./task1-types";
import { applyFilters } from "./task3-filters";


export const filterByTitle = (query: string): BookFilter => {
  return (book: Book) =>
    book.title.toLowerCase().includes(query.toLowerCase());
};


export function sortBooks(books: Book[], sortType: "year" | "rating"): Book[] {
  if (sortType === "year") {
    return [...books].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  }
  
  // Сортировка по рейтингу: от высокого к низкому (по убыванию)
  return [...books].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
}


/** @deprecated пока не используется, задел на фичу "Композиция фильтров" */
export function filterAndSortBooks(
  books: Book[],
  query: string,
  sortType: "year" | "rating"
): Book[] {
  const filtered = applyFilters(books, [filterByTitle(query)]);
  return sortBooks(filtered, sortType);
}