import './styles.css';
import { Book } from './task1-types'; // Убран Catalog (требование Задания 6)
import { applyFilters, filterByAuthor, filterByMinYear } from './task3-filters';
import { createBookFromForm } from './task4-integration';
import { filterByTitle, sortBooks } from './task5-utils';
import { BookCatalog } from './task6-classes';
import { Wishlist } from './task7-wishlist';

// Инициализация каталога
let catalog = new BookCatalog('main', [
  { id: '1', title: 'TypeScript Guide', authors: ['John Doe'], year: 2024 },
  { id: '2', title: 'JavaScript Basics', authors: ['Jane Smith'], year: 2022 }
]);

// Восстановление из localStorage
const saved = localStorage.getItem('catalog');
if (saved) {
  const parsed = JSON.parse(saved);
  catalog = new BookCatalog(parsed.id, parsed.books);
}

// Сохранение В localStorage
function saveCatalog() {
  localStorage.setItem('catalog', JSON.stringify({ 
    id: catalog.id, 
    books: catalog.getBooks() 
  }));
}

let wishlist: Wishlist;
const savedWishlist = localStorage.getItem('wishlist');
if (savedWishlist) {
  try {
    const parsedWishlist = JSON.parse(savedWishlist);
    wishlist = new Wishlist(parsedWishlist);
  } catch {
    wishlist = new Wishlist();
  }
} else {
  wishlist = new Wishlist();
}

function saveWishlist() {
  localStorage.setItem('wishlist', JSON.stringify(wishlist.getIds()));
}

// DOM-элементы
const bookList = document.querySelector('#bookList') as HTMLDivElement;
const form = document.querySelector('#bookForm') as HTMLFormElement;
const filterBtn = document.querySelector('#applyFilters') as HTMLButtonElement;
const authorInput = document.querySelector('#filterAuthor') as HTMLInputElement;
const yearInput = document.querySelector('#filterYear') as HTMLInputElement;
const errorMessage = document.querySelector('#errorMessage') as HTMLDivElement;
const searchInput = document.querySelector('#searchInput') as HTMLInputElement;
const sortBySelect = document.querySelector('#sortBy') as HTMLSelectElement;

function createBookCard(book: Book): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'book-card';

  const titleEl = document.createElement('h3');
  titleEl.textContent = `${book.title} — ${book.authors.join(', ')}${book.year ? `, ${book.year}` : ''}`;
  card.append(titleEl);

  if (book.rating !== undefined) {
    const ratingEl = document.createElement('p');
    ratingEl.textContent = `Рейтинг: ${book.rating}`;
    card.append(ratingEl);
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Удалить';
  deleteBtn.addEventListener('click', () => {
    catalog.removeBook(book.id);
    saveCatalog();
    renderBooks(catalog.getBooks());
    
    renderWishlist();
  });
  card.append(deleteBtn);

  const favBtn = document.createElement('button');
  favBtn.textContent = wishlist.has(book.id) ? '❤️ В избранном' : '🤍 В избранное';
  favBtn.addEventListener('click', () => {
    wishlist.toggle(book.id);
    saveWishlist();
    renderBooks(catalog.getBooks());
    renderWishlist();
  });
  card.append(favBtn);

  return card;
}

// Отрисовка основного списка
function renderBooks(books: Book[]) {
  bookList.innerHTML = '';

  if (books.length === 0) {
    bookList.textContent = 'Книги не найдены. Попробуйте изменить фильтры.';
    return;
  }

  books.forEach(book => {
    bookList.append(createBookCard(book));
  });
}

// Первичная отрисовка
renderBooks(catalog.getBooks());

renderWishlist();

// Обработчик формы
form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorMessage.textContent = '';
  try {
    const formData = new FormData(form);
    const newBook = createBookFromForm(formData);

    catalog.addBook(newBook);
    saveCatalog();
    form.reset();

    renderBooks(catalog.getBooks());
    
    renderWishlist();
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.textContent = error.message;
    }
  }
});

// Фильтры и сортировка
function refreshList() {
  const filters: ((book: Book) => boolean)[] = [];

  if (authorInput.value.trim()) filters.push(filterByAuthor(authorInput.value.trim()));
  if (yearInput.value) filters.push(filterByMinYear(parseInt(yearInput.value, 10)));
  if (searchInput.value.trim()) filters.push(filterByTitle(searchInput.value.trim()));

  const allBooks = catalog.getBooks();
  const filteredBooks = applyFilters(allBooks, filters);

  renderBooks(sortBooks(filteredBooks, sortBySelect.value as 'year' | 'rating'));
}

filterBtn.addEventListener('click', refreshList);
searchInput.addEventListener('input', refreshList);
sortBySelect.addEventListener('change', refreshList);

function renderWishlist() {
  const container = document.querySelector('#wishlistContainer') as HTMLDivElement;
  container.innerHTML = '';

  const favBooks = wishlist.getFavorites(catalog);

  if (favBooks.length === 0) {
    container.textContent = 'Пока ничего не добавлено';
    return;
  }

  // Переиспользуем функцию создания карточки
  favBooks.forEach(book => {
    container.append(createBookCard(book));
  });
}