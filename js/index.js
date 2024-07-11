function submitForm() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var feedback = document.getElementById("feedback").value;
  
    var message = "Name: " + name + "\n";
    message += "Email: " + email + "\n";
    message += "Phone: " + phone + "\n\n";
    message += "Feedback: " + feedback;
  
    var mailToLink = "mailto:kumarankit11458@gmail.com?subject=Feedback&body=" + encodeURIComponent(message);
  
    window.location.href = mailToLink;
  }
  document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
  });
  function searchGames() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const gameBoxes = document.querySelectorAll('.portfolio-box');
    
    gameBoxes.forEach(box => {
        const gameTitle = box.querySelector('h4').innerText.toLowerCase();
        if (gameTitle.includes(input)) {
            box.style.display = 'block';
        } else {
            box.style.display = 'none';
        }
    });
}