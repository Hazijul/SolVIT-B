document.addEventListener('DOMContentLoaded', () => {
    window.searchItems = function() {
        const searchQuery = document.getElementById('searchInput').value.toLowerCase();
        if (searchQuery) {
            window.location.href = `marketplace.html?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    // Handle Enter key press for search
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchItems();
        }
    });
});