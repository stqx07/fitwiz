document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const skillpointsElement = document.getElementById("skillpoints");
  const potionList = document.querySelector(".row.g-4");

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

  const showPermanentMessage = (elementId, message, type) => {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="alert alert-${type} col-xl-4 col-lg-6 col-md-12 p-3 mx-auto">${message}</div>`;
  };

  // Callback to populate potion shop
  const callbackForPotions = (responseStatus, responseData) => {
    if (responseStatus === 200) {
      potionList.innerHTML = ""; // Clear existing potions

      responseData.forEach((potion) => {
        const potionCard = document.createElement("div");
        potionCard.className = "col-12 col-sm-6 col-md-4 col-lg-3";
        potionCard.innerHTML = `
          <div class="card custom-card h-100 mx-auto">
            <img src="images/potion${potion.potion_id}.webp" alt="Potion" class="card-img-top">
            <div class="card-body text-center">
              <h5 class="card-title">${potion.potion_name}</h5>
              <p class="card-text">${potion.potion_description}</p>
              <p class="card-text">
                <strong>Potion ID:</strong> ${potion.potion_id} |
                ${
                  potion.potion_heal
                    ? `<strong>Heal:</strong> ${potion.potion_heal} Health`
                    : `<strong>Damage:</strong> ${potion.potion_damage} Damage`
                } |
                <strong>Cost:</strong> ${potion.potion_cost} Skillpoints
              </p>
              <button class="btn btn-primary buy-potion-btn" data-potion-id="${potion.potion_id}">Buy</button>
            </div>
          </div>
        `;
        potionList.appendChild(potionCard);
      });

      // Add event listeners to Buy buttons
      document.querySelectorAll(".buy-potion-btn").forEach((button) => {
        button.addEventListener("click", handlePurchase);
      });
    } else {
      showMessageCard("Failed to load potions. Please try again later.", "danger");
    }
  };

  // Handle potion purchase
  const handlePurchase = (event) => {
    const potionId = event.target.getAttribute("data-potion-id");
    if (!token) {
      showMessageCard("You must be logged in to purchase potions!", "warning");
      return;
    }

    // Use fetchMethod to send the purchase request
    fetchMethod(
      `${currentUrl}/api/diagonAlley/potionShop/purchase`,
      callbackForPurchase,
      "POST",
      { potionId },
      token
    );
  };

  // Callback for purchase response
  const callbackForPurchase = (responseStatus, responseData) => {
    if (responseStatus === 200) {
      showMessageCard("Potion purchased successfully!", "success");
      skillpointsElement.textContent = responseData.updatedSkillpoints;
    } else if (responseStatus === 400 || responseStatus === 403) {
      const errorMessage = responseData?.message || "Unable to complete the purchase.";
      showMessageCard(errorMessage, "warning");
    } else {
      const errorMessage = responseData?.message || "An error occurred while purchasing the potion.";
      showMessageCard(errorMessage, "danger");
    }
  };

  // Fetch potions on page load
  fetchMethod(`${currentUrl}/api/diagonAlley/potionShop`, callbackForPotions, "GET", null, token);
});
