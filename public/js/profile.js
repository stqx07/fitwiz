document.addEventListener("DOMContentLoaded", function () {
  const editButton = document.getElementById("editButton");
  const saveButton = document.getElementById("saveButton");
  const userInfoForm = document.getElementById("userInfoForm");
  const userInfoDisplay = document.getElementById("userInfoDisplay");
  const houseButtons = document.querySelectorAll(".house-button");
  const houseMessage = document.getElementById("houseMessage");
  const chooseHouseButton = document.getElementById("chooseHouseButton");
  const houseDisplay = document.getElementById("houseDisplay");
  const houseName = document.getElementById("houseName");
  const houseEmblem = document.getElementById("houseEmblem");

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
  
    houseButtons.forEach(button => {
      button.addEventListener("click", function () {
        const selectedHouse = button.dataset.house;
        const emblemSrc = button.dataset.emblem;
        // Update house display
        houseMessage.classList.add("d-none");
        chooseHouseButton.classList.add("d-none");
        houseDisplay.classList.remove("d-none");
        houseName.textContent = selectedHouse;
        houseEmblem.src = emblemSrc;
        houseEmblem.alt = `${selectedHouse} Emblem`;
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById("houseModal"));
        modal.hide();
      });
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    // Select all house buttons
    const houseButtons = document.querySelectorAll(".btn[data-house]");
  
    houseButtons.forEach(button => {
      button.addEventListener("click", () => {
        // Get the selected house and emblem from the button's data attributes
        const selectedHouse = button.getAttribute("data-house");
        const selectedEmblem = button.getAttribute("data-emblem");
  
        // Update the house message
        const houseMessage = document.getElementById("houseMessage");
        const houseDescriptionElement = document.createElement("p"); // Create a new paragraph for the description
        houseDescriptionElement.setAttribute("id", "houseDescription"); // Add an ID for styling if needed
  
        let houseDescription = "";
  
        switch (selectedHouse) {
          case "Gryffindor":
            houseDescription = "Bravery, daring, and chivalry define you. The sword of Godric Gryffindor shines in your honor!";
            break;
          case "Ravenclaw":
            houseDescription = "Wisdom, wit, and learning are your strengths. The eagles soar high with your intellect!";
            break;
          case "Hufflepuff":
            houseDescription = "Loyalty, patience, and kindness guide you. You embody the warmth of the golden badger!";
            break;
          case "Slytherin":
            houseDescription = "Ambition, cunning, and resourcefulness are your virtues. The serpent rises with your cleverness!";
            break;
          default:
            houseDescription = "Welcome to the magical world of Hogwarts!";
        }
  
        houseMessage.textContent = `You belong to ${selectedHouse}!`;
        houseDescriptionElement.textContent = houseDescription;
  
        houseMessage.insertAdjacentElement("afterend", houseDescriptionElement);
  
        // Update the house emblem
        const houseEmblem = document.getElementById("houseEmblem");
        houseEmblem.src = selectedEmblem;
        houseEmblem.alt = `${selectedHouse} Emblem`;
  
        // Remove the "Choose House" button
        const chooseHouseButton = document.getElementById("chooseHouseButton");
        chooseHouseButton.style.display = "none"; // Hides the button
  
        // Close the modal
        const houseModal = document.getElementById("houseModal");
        const modalInstance = bootstrap.Modal.getInstance(houseModal);
        modalInstance.hide();
      });
    });
  });