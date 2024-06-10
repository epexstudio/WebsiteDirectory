document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("websiteForm");
  const websiteList = document.getElementById("websiteList");
  const searchInput = document.getElementById("search");
  const pagination = document.getElementById("pagination");
  const cancelEditButton = document.getElementById("cancelEdit");
  const itemsPerPage = 5;
  let currentPage = 1;
  let websites = [];
  let isEditing = false;
  let editId = null;

  const fetchWebsites = async () => {
    const response = await fetch("http://localhost:3000/api/websites");
    websites = await response.json();
    renderTable();
  };

  const renderTable = () => {
    const filteredWebsites = websites.filter((website) =>
      website.title.toLowerCase().includes(searchInput.value.toLowerCase())
    );
    const totalItems = filteredWebsites.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedWebsites = filteredWebsites.slice(start, end);

    websiteList.innerHTML = "";
    paginatedWebsites.forEach((website) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${website.title}</td>
                <td><a href="${website.url}" target="_blank">${website.url}</a></td>
                <td class="actions">
                    <button onclick="editWebsite(${website.id})">Edit</button>
                    <button onclick="deleteWebsite(${website.id})">Delete</button>
                </td>
            `;
      websiteList.appendChild(row);
    });

    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.innerText = i;
      pageButton.disabled = i === currentPage;
      pageButton.addEventListener("click", () => {
        currentPage = i;
        renderTable();
      });
      pagination.appendChild(pageButton);
    }
  };

  const addWebsite = async (title, url) => {
    const response = await fetch("http://localhost:3000/api/websites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, url }),
    });
    const newWebsite = await response.json();
    websites.push(newWebsite);
    renderTable();
  };

  const updateWebsite = async (id, title, url) => {
    const response = await fetch(`http://localhost:3000/api/websites/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, url }),
    });
    const updatedWebsite = await response.json();
    const index = websites.findIndex((w) => w.id === id);
    websites[index] = updatedWebsite;
    renderTable();
  };

  const deleteWebsite = async (id) => {
    await fetch(`http://localhost:3000/api/websites/${id}`, {
      method: "DELETE",
    });
    websites = websites.filter((w) => w.id !== id);
    renderTable();
  };

  const editWebsite = (id) => {
    const website = websites.find((w) => w.id === id);
    document.getElementById("websiteId").value = website.id;
    document.getElementById("title").value = website.title;
    document.getElementById("url").value = website.url;
    form.querySelector('button[type="submit"]').innerText = "Update Website";
    cancelEditButton.style.display = "inline-block";
    isEditing = true;
    editId = id;
  };

  cancelEditButton.addEventListener("click", () => {
    resetForm();
  });

  const resetForm = () => {
    document.getElementById("websiteId").value = "";
    document.getElementById("title").value = "";
    document.getElementById("url").value = "";
    form.querySelector('button[type="submit"]').innerText = "Add Website";
    cancelEditButton.style.display = "none";
    isEditing = false;
    editId = null;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const url = document.getElementById("url").value;

    if (isEditing) {
      await updateWebsite(editId, title, url);
    } else {
      await addWebsite(title, url);
    }
    resetForm();
    fetchWebsites();
  });

  searchInput.addEventListener("input", renderTable);

  fetchWebsites();
});

window.deleteWebsite = async (id) => {
  if (confirm("Are you sure you want to delete this website?")) {
    await deleteWebsite(id);
  }
};

window.editWebsite = (id) => {
  editWebsite(id);
};
