const books = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'BOOK_APPS';
// deklarasi untuk custom dialog
const modal = document.querySelector('dialog');
const closeModal = document.getElementById('batal');

// cek fitur storage
function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    } else {
        return true;
    }
}

// kustom event render
document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (const book of books) {
        const bookElement = tampilkanBuku(book);
        if (!book.isComplete) {
            incompleteBookshelfList.append(bookElement);
        } else {
            completeBookshelfList.append(bookElement);
        }
    }
});

// perintah tampilkan buku di rak
function tampilkanBuku(book) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = book.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = 'penulis: ' + book.author;

    const textYear = document.createElement('p');
    textYear.innerText = 'Tahun: ' + book.year;

    const articleContainer = document.createElement('article');
    articleContainer.setAttribute('id', `book-${book.id}`);
    articleContainer.classList.add('book_item');
    articleContainer.append(textTitle, textAuthor, textYear);

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');

    if (book.isComplete) {
        const belumDibacaBtn = document.createElement('button');
        belumDibacaBtn.classList.add('green');
        belumDibacaBtn.innerText = 'Belum selesai di Baca';
        belumDibacaBtn.addEventListener('click', function () {
            bukuBelumDibaca(book.id);
        });

        actionContainer.append(belumDibacaBtn);
    } else {
        const sudahDibacaBtn = document.createElement('button');
        sudahDibacaBtn.classList.add('green');
        sudahDibacaBtn.innerText = 'Selesai dibaca';
        sudahDibacaBtn.addEventListener('click', function () {
            bukuSudahDibaca(book.id);
        });

        actionContainer.append(sudahDibacaBtn);
    }

    const hapusBtn = document.createElement('button');
    hapusBtn.classList.add('red');
    hapusBtn.innerText = 'Hapus buku';
    hapusBtn.addEventListener('click', function () {
        // tampilkan custom dialog
        const confirmModal = document.getElementById('ya');
        confirmModal.value = book.id;
        modal.show();

        confirmModal.addEventListener('click', () => {
            hapusBuku(parseInt(confirmModal.value));
            modal.close();
        })
    });

    actionContainer.append(hapusBtn);

    articleContainer.append(actionContainer);

    return articleContainer;
}

// perintah buku sudah dibaca
function bukuSudahDibaca(bookId) {
    const buku = cariBuku(bookId);

    if (buku == null) return;

    buku.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    updateStorage();
}

// perintah buku belum dibaca
function bukuBelumDibaca(bookId) {
    const buku = cariBuku(bookId);

    if (buku == null) return;

    buku.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    updateStorage();
}

// perintah hapus buku dari rak
function hapusBuku(bookId) {
    const buku = cariBukuIndex(bookId);

    if (buku === -1) return;

    books.splice(buku, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    updateStorage();
}

// cari buku dengan id
function cariBuku(bookId) {
    for (const buku of books) {
        if (buku.id === bookId) {
            return buku;
        }
    }
    return null;
}

function cariBukuIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

// simpan di local storage
function updateStorage() {
    if (isStorageExist()) {
        const push = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, push);
    }
}

// event ketika load konten dom html selesai
document.addEventListener('DOMContentLoaded', function () {
    const inputForm = document.getElementById('inputBook');
    inputForm.addEventListener('submit', function (event) {
        event.preventDefault();
        tambahBuku();
    });

    const searchForm = document.getElementById('searchBook');
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        cariRakBuku();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

// tambah buku di larik books
function tambahBuku() {
    const judulBuku = document.getElementById('inputBookTitle').value;
    const penulisBuku = document.getElementById('inputBookAuthor').value;
    const tahunBuku = document.getElementById('inputBookYear').value;
    const statusBuku = document.getElementById('inputBookIsComplete').checked;

    const generatedID = bukuId();
    const buku = booksObject(generatedID, judulBuku, penulisBuku, tahunBuku, statusBuku);
    books.push(buku);

    document.dispatchEvent(new Event(RENDER_EVENT));
    updateStorage();
}

// perintah mencari buku spesifik
function cariRakBuku() {
    const cariBuku = document.getElementById('searchBookTitle').value.toUpperCase();
    const cariJudul = document.querySelectorAll('h3');

    for (const judul of cariJudul) {
        judul.parentElement.style.display = 'block';
        if (!judul.innerText.toUpperCase().includes(cariBuku)) {
            judul.parentElement.style.display = 'none';
        }
    }
}

// perintah buat random id
function bukuId() {
    return +new Date();
}

// perintah membuat object
function booksObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

// dapatkan data dari lokal storage
function loadDataFromStorage() {
    const pull = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(pull);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

// custom dialog batal
closeModal.addEventListener('click', () => {
    modal.close();
});