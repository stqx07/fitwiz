document.addEventListener("DOMContentLoaded", function () {
  const itemFilter = document.getElementById("itemFilter");
  const vaultItems = document.querySelectorAll(".vault-item");
  itemFilter.addEventListener("change", function () {
    const selectedType = this.value;
    vaultItems.forEach(item => {
      if (item.dataset.type === selectedType) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
  // Trigger filter on page load to show the default selection
  itemFilter.dispatchEvent(new Event("change"));
});