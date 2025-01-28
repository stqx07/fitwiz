document.addEventListener("DOMContentLoaded", function () {
  const editButton = document.getElementById("editButton");
  const saveButton = document.getElementById("saveButton");
  const userInfoForm = document.getElementById("userInfoForm");
  const userInfoDisplay = document.getElementById("userInfoDisplay");
  
  // Toggle between display and edit mode
  editButton.addEventListener("click", () => {
    userInfoDisplay.classList.toggle("d-none");
    userInfoForm.classList.toggle("d-none");
  });
  
  // Save button functionality to return to display mode
  saveButton.addEventListener("click", () => {
    // Update display fields with new values from the form
    const newUsername = document.getElementById("username").value;
    userInfoDisplay.innerHTML = `
    <p class="mb-2">
      <span class="d-block">
        <strong>User ID:</strong> <span class="text-light">1</span>
      </span>
    </p>
    <p class="mb-2">
      <span class="d-block">
        <strong>Username:</strong> <span class="text-light">${newUsername}</span>
      </span>
    </p>
    <p class="mb-2">
      <span class="d-block">
        <strong>Email:</strong> <span class="text-light">user@example.com</span>
      </span>
    </p>
    <div class="d-flex justify-content-center align-items-center">
      <img src="images/coin.png" alt="Coin Icon" style="width: 32px; height: 32px; margin-right: 8px;">
      <span class="badge bg-warning text-dark px-3 py-2 d-flex align-items-center">
        <strong>Skillpoints:</strong> <span id="skillpoints" class="ms-2">150</span>
      </span>
    </div>
  `;
  
    // Toggle back to display mode
    userInfoForm.classList.add("d-none");
    userInfoDisplay.classList.remove("d-none");
  });
});