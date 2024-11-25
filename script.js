document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#glossary tbody");
  const categoryFilter = document.querySelector("#category-filter");

  // Fetch JSON data
  fetch("glossary.json")
    .then((response) => response.json())
    .then((data) => {
      populateTable(data);
      populateFilter(data);
    });

  // Populate Table
  function populateTable(data) {
    tableBody.innerHTML = ""; // Clear previous data
    data.forEach((entry) => {
      const row = `
        <tr>
          <td><strong>${entry["English Term"]}</strong></td>
          <td>${entry["Spanish Term"]}</td>
          <td>${entry["Category"]}</td>
          <td>
            <em>${entry["English Example"]}</em><br>
            <em>${entry["Spanish Example"]}</em>
          </td>
        </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
  }

  // Populate Filter
  function populateFilter(data) {
    const categories = [...new Set(data.map((entry) => entry.Category))];
    categories.forEach((category) => {
      const option = `<option value="${category}">${category}</option>`;
      categoryFilter.insertAdjacentHTML("beforeend", option);
    });

    categoryFilter.addEventListener("change", () => {
      const selectedCategory = categoryFilter.value;
      const filteredData = selectedCategory
        ? data.filter((entry) => entry.Category === selectedCategory)
        : data;
      populateTable(filteredData);
    });
  }
});
