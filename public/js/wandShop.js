document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const skillpointsElement = document.getElementById("skillpoints");
  const wandList = document.querySelector(".row.g-4");

  const showMessageCard = (message, type, reload = false) => {
    const messageCard = document.createElement("div");
    messageCard.className = `alert alert-${type} message-card`;
    messageCard.textContent = message;
    document.body.appendChild(messageCard);
    setTimeout(() => {
      messageCard.classList.add("fade-out");
      setTimeout(() => {
        document.body.removeChild(messageCard);
        if (reload) {
          location.reload();
        }
      }, 1000);
    }, 3000);
  };

  // Callback to populate wand shop
  const callbackForWands = (responseStatus, responseData) => {
    if (responseStatus === 200) {
      wandList.innerHTML = ""; // Clear existing wands

      responseData.forEach((wand) => {
        const wandCard = document.createElement("div");
        wandCard.className = "col-12 col-sm-6 col-md-4 col-lg-3";
        wandCard.innerHTML = `
          <div class="card custom-card h-100 mx-auto">
            <img src="images/wand${wand.wand_id}.png" alt="Wand" class="card-img-top">
            <div class="card-body text-center">
              <h5 class="card-title">${wand.wand_name}</h5>
              <p class="card-text">
                <strong>Wand ID:</strong> ${wand.wand_id} | 
                <strong>Cost:</strong> ${wand.wand_cost} Skillpoints
              </p>
              <button class="btn btn-primary buy-wand-btn" data-wand-id="${wand.wand_id}">Buy</button>
            </div>
          </div>
        `;
        wandList.appendChild(wandCard);
      });

      // Add event listeners to Buy buttons
      document.querySelectorAll(".buy-wand-btn").forEach((button) => {
        button.addEventListener("click", handlePurchase);
      });
    } else {
      showMessageCard("Failed to load wands. Please try again later.", "danger");
    }
  };

  // Handle wand purchase
  const handlePurchase = (event) => {
    const wandId = event.target.getAttribute("data-wand-id");
    if (!token) {
      showMessageCard("You must be logged in to purchase wands!", "warning");
      return;
    }

    fetchMethod(
      `${currentUrl}/api/diagonAlley/wandShop/purchase`,
      callbackForPurchase,
      "POST",
      { wandId },
      token
    );
  };

  // Callback for purchase response
  const callbackForPurchase = (responseStatus, responseData) => {
    if (responseStatus === 200) {
      showMessageCard("Spell purchased successfully!", "success");
      skillpointsElement.textContent = responseData.updatedSkillpoints;
    } else if (responseStatus === 400 || responseStatus === 403) {
      const errorMessage = responseData?.message || "Unable to complete the purchase.";
      showMessageCard(errorMessage, "warning");
    } else {
      const errorMessage = responseData?.message || "An error occurred while purchasing the wand.";
      showMessageCard(errorMessage, "danger");
    }
  };

  // Fetch wands on page load
  fetchMethod(`${currentUrl}/api/diagonAlley/wandShop`, callbackForWands, "GET", null, token);
});