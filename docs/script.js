const toggleFormBtn = document.getElementById("toggle-form");
const bookForm = document.getElementById("book-form");
const typeSelect = document.getElementById("type");
const ebookDetails = document.getElementById("ebook-details");
const bookList = document.getElementById("book-list");
const addBooksection = document.querySelector(".add-book-section");
let books = [];

toggleFormBtn.addEventListener("click", () => {
    if (addBooksection.style.display === 'none') {
        addBooksection.style.display = 'block';
        toggleFormBtn.textContent = 'Hide Form';
    } else {
        addBooksection.style.display = 'none';
        toggleFormBtn.textContent = 'Add New Book';
    }
});

typeSelect.addEventListener("change", () => {
    ebookDetails.style.display = typeSelect.value === 'E-Book' ? 'block' : 'none';
});

bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    let book;

    if (typeSelect.value === 'E-Book') {
        const fileSize = document.getElementById('fileSize').value;
        book = new EBook(title, author, fileSize);
    } else {
        book = new Book(title, author);
    }

    books.push(book);
    saveBooks();
    displayBooks();
    bookForm.reset();
});

class Book {
    constructor(title, author) {
        this.title = title;
        this.author = author;
        this.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
        this.type = 'physical';
        this.available = true;
        this.borrower = null;
    }

    borrow(borrower) {
        this.available = false;
        this.borrower = borrower;
    }

    markReturn() {
        this.available = true;
        this.borrower = null;
    }

    getHTML() {
        return `
        <div class="book-card" data-id="${this.id}">
            <h3 class="book-title">${this.title}</h3>
            <div class="book-meta">Author: ${this.author}</div>
            <div class="book-meta">Status: ${this.borrower ? `Borrowed by ${this.borrower}` : 'Available'}</div>
            <div class="book-actions">
                ${this.available ? 
                    `<button class="btn btn-borrow">Borrow</button>` : 
                    `<button class="btn btn-return">Return</button>`}
                <button class="btn btn-remove">Remove</button>
            </div>
        </div>`;
    }
}

class EBook extends Book {
    constructor(title, author, fileSize) {
        super(title, author);
        this.fileSize = fileSize;
        this.type = 'ebook';
    }

    borrow(borrower) {
        this.borrower = borrower;
    }

    markReturn() {
        this.borrower = null;
    }

    getHTML() {
        return `
        <div class="book-card ebook" data-id="${this.id}">
            <h3 class="book-title">${this.title}</h3>
            <div class="book-meta">Author: ${this.author}</div>
            <div class="book-meta">File Size: ${this.fileSize} MB</div>
            <div class="book-meta">Status: ${this.borrower ? `Downloaded by ${this.borrower}` : 'Available'}</div>
            <div class="book-actions">
                ${this.borrower ? 
                    `<button class="btn btn-return">Return</button>` : 
                    `<button class="btn btn-borrow">Download</button>`}
                <button class="btn btn-remove">Remove</button>
            </div>
        </div>`;
    }
}

function displayBooks() {
    bookList.innerHTML = '';

    if (books.length === 0) {
        bookList.innerHTML = 'No books found';
    } else {
        books.forEach(b => {
            bookList.innerHTML += b.getHTML();
        });

        document.querySelectorAll('.btn-borrow').forEach(btn => {
            btn.addEventListener("click", (e) => {
                const bookId = e.target.closest('.book-card').getAttribute("data-id");
                const bookBorrower = prompt('Enter your name');
                if (bookBorrower) {
                    borrowBooks(bookId, bookBorrower);
                }
            });
        });

        document.querySelectorAll('.btn-return').forEach(btn => {
            btn.addEventListener("click", (e) => {
                const bookId = e.target.closest('.book-card').getAttribute("data-id");
                returnBooks(bookId);
            });
        });

        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener("click", (e) => {
                const confirmRemove = confirm("Are you sure you want to remove this book?");
                if (confirmRemove) {
                    const bookId = e.target.closest('.book-card').getAttribute("data-id");
                    removeBooks(bookId);
                }
            });
        });
    }
}

function borrowBooks(bookId, bookBorrower) {
    books.forEach(b => {
        if (b.id === bookId) {
            b.borrow(bookBorrower);
        }
    });
    saveBooks();
    displayBooks();
}

function returnBooks(bookId) {
    books.forEach(b => {
        if (b.id === bookId) {
            b.markReturn();
        }
    });
    saveBooks();
    displayBooks();
}

function removeBooks(bookId) {
    books = books.filter(book => book.id !== bookId);
    saveBooks();
    displayBooks();
}

function saveBooks() {
    localStorage.setItem("booksArray", JSON.stringify(books));
}

function loadBooks() {
    const storedBooks = localStorage.getItem("booksArray");
    const bookObjects = storedBooks ? JSON.parse(storedBooks) : [];

    books = bookObjects.map(obj => {
        const book = obj.type === "ebook" ? 
            new EBook(obj.title, obj.author, obj.fileSize) : 
            new Book(obj.title, obj.author);
        book.id = obj.id;
        book.borrower = obj.borrower;
        book.available = obj.available;
        return book;
    });
}

function addDefaultBooks() {
    const defaultBooks = [
        new Book("To Kill a Mockingbird", "Harper Lee"),
        new Book("1984", "George Orwell"),
        new Book("The Great Gatsby", "F. Scott Fitzgerald"),
        new Book("Pride and Prejudice", "Jane Austen")
    ];

    const defaultEbooks = [
        new EBook("The Digital Age", "Mark Stevenson", 3.5),
        new EBook("Programming Basics", "John Smith", 8.2),
        new EBook("Artificial Intelligence", "Alan Turing", 5.7)
    ];

    [...defaultBooks, ...defaultEbooks].forEach(book => books.push(book));
    saveBooks();
}

document.addEventListener("DOMContentLoaded", () => {
    loadBooks();
    if (books.length === 0) {
        addDefaultBooks();
    }
    displayBooks();
});
