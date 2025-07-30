document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookmark-form");
  const buttons = document.querySelectorAll(".filter-btn");
  const bookmarksList = document.getElementById("bookmarks-list");

  let bookmarks = [];
  let filterArr = [];
  let currentFilter = "All";

  // Load bookmarks from localStorage
  loadBookmarks();
  applyFilter();

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("website-title").value.trim();
    const url = document.getElementById("website-url").value.trim();
    const category = document.getElementById("category").value;

    if (!title || !url) {
      alert("Please fill in both Title and URL");
      return;
    }

    try {
      new URL(url); // Basic validation
    } catch {
      alert("Please enter a valid URL");
      return;
    }

    const bookmark = {
      id: Date.now(),
      title,
      url,
      category,
    };

    bookmarks.push(bookmark);
    saveBookmarks();
    applyFilter();
    form.reset();
  });

  // Handle filter button clicks
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.getAttribute("data-filter");

      // Update active class
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      applyFilter();
    });
  });

  // Filter bookmarks based on category
  function applyFilter() {
    if (currentFilter === "All") {
      filterArr = bookmarks;
    } else {
      filterArr = bookmarks.filter((b) => b.category === currentFilter);
    }
    renderBookmarks();
  }

  // Render bookmarks in UI
  function renderBookmarks() {
    bookmarksList.innerHTML = "";

    if (filterArr.length === 0) {
      bookmarksList.innerHTML = `<p>No bookmarks found</p>`;
      return;
    }

    filterArr.forEach((b) => {
      const bookmarkItem = document.createElement("div");
      bookmarkItem.classList.add("bookmark-item");

      bookmarkItem.innerHTML = `
        <div class="bookmark-info">
          <h3>${b.title}</h3>
          <a href="${b.url}" target="_blank" class="bookmark-link">${b.url}</a>
          <div class="bookmark-category">${b.category}</div>
        </div>
        <button class='delete-btn'>Delete</button>
      `;

      const deleteBtn = bookmarkItem.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", () => handleDelete(b.id));

      bookmarksList.appendChild(bookmarkItem);
    });
  }

  // Delete bookmark by ID
  function handleDelete(id) {
    bookmarks = bookmarks.filter((b) => b.id !== id);
    saveBookmarks();
    applyFilter();
  }

  // Save bookmarks to localStorage
  function saveBookmarks() {
    localStorage.setItem("bookmarksArray", JSON.stringify(bookmarks));
  }

  // Load bookmarks from localStorage
  function loadBookmarks() {
    const stored = localStorage.getItem("bookmarksArray");
    bookmarks = stored ? JSON.parse(stored) : [];
  }
});
