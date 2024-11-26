// Variable to store glossary data
let data = [];
let posSortAsc = true; // State to track sort direction
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Function to render the table rows dynamically
const renderTable = (filteredData) => {
  const tableBody = document.querySelector('#glossary-table tbody');
  tableBody.innerHTML = '';
  filteredData.forEach(entry => {
    const row = `
      <tr>
        <td class="term" data-label="English Term">${entry['English Term']}</td>
        <td class="term" data-label="Spanish Term">${entry['Spanish Term']}</td>
        <td class="part-of-speech" data-label="Part of Speech">${entry['Part of Speech']}</td>
        <td data-label="Category">${entry['Category']}</td>
        <td class="example" data-label="Examples">${entry['English Example']} / ${entry['Spanish Example']}</td>
      </tr>
    `;
    tableBody.insertAdjacentHTML('beforeend', row);
  });
};

document.getElementById('search-bar').addEventListener('input', (event) => {
  const searchTerm = event.target.value.toLowerCase();
  const filteredData = data.filter(entry =>
    entry['English Term'].toLowerCase().includes(searchTerm) ||
    entry['Spanish Term'].toLowerCase().includes(searchTerm) ||
    entry['Part of Speech'].toLowerCase().includes(searchTerm) ||
    entry['Category'].toLowerCase().includes(searchTerm)
  );
  renderTable(filteredData);
});



// Function to sort data by Part of Speech
const sortDataByPOS = () => {
  data.sort((a, b) => {
    if (a['Part of Speech'] < b['Part of Speech']) return posSortAsc ? -1 : 1;
    if (a['Part of Speech'] > b['Part of Speech']) return posSortAsc ? 1 : -1;
    return 0;
  });
};

// Event listener for sorting by Part of Speech
const addSortingListeners = () => {
  const posHeader = document.getElementById('sort-pos');
  posHeader.addEventListener('click', () => {
    posSortAsc = !posSortAsc; // Toggle sort direction
    sortDataByPOS(); // Sort data
    renderTable(data); // Re-render table with sorted data
    posHeader.textContent = `Part of Speech ${posSortAsc ? '🔽' : '🔼'}`; // Update header arrow
  });
};

// Function to filter data by category
const filterByCategory = (selectedCategory) => {
  return selectedCategory
    ? data.filter(item => item.Category === selectedCategory)
    : data;
};

// Function to toggle dark mode
const toggleDarkMode = () => {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);
  localStorage.setItem('darkMode', isDarkMode);
  const button = document.getElementById('dark-mode-toggle');
  button.innerHTML = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
};

// Wrap the fetch and initialization code in DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
  fetch('glossary.json')
    .then(response => response.json())
    .then(loadedData => {
      data = loadedData; // Store data globally
      const categoryFilter = document.getElementById('category-filter');

      // Populate filter dropdown
      const categories = [...new Set(data.map(item => item.Category))];
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
      });

      // Initial render of the table
      renderTable(data);

      // Event listener for filtering
      categoryFilter.addEventListener('change', () => {
        const selectedCategory = categoryFilter.value;
        const filteredData = filterByCategory(selectedCategory);
        renderTable(filteredData);
      });

      // Add sorting functionality
      addSortingListeners();

      // Initialize dark mode from localStorage
      if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-mode-toggle').innerHTML = '☀️ Light Mode';
      }

      // Add dark mode toggle listener
      document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
    })
    .catch(error => console.error('Error loading glossary data:', error));
});
