// Handle Edit Button Click
document.querySelectorAll('.btn-edit').forEach(button => {
  button.addEventListener('click', event => {
    const card = event.target.closest('.card');
    const challengeName = card.querySelector('.card-title').innerText;
    const skillPoints = card.querySelector('.card-text').innerText.match(/Skillpoints:\s(\d+)/)[1];

    // Populate Modal Fields
    document.getElementById('editChallengeName').value = challengeName;
    document.getElementById('editSkillPoints').value = skillPoints;
  });
});