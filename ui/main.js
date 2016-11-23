
function loadLoginForm () {
var loginHtml = `
     <h3>Login/Register to unlock awesome features</h3>
     <input type="text" id="username" placeholder="username" />
     <input type="password" id="password" />
     <br/><br/>
     <input type="submit" id="login_btn" value="Login" />
     <input type="submit" id="register_btn" value="Register" />
     `;
document.getElementById('login_area').innerHTML = loginHtml;
}

function loadLogin () {
// Check if the user is already logged in
var request = new XMLHttpRequest();
request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
            loadLoggedInUser(this.responseText);
        } else {
            loadLoginForm();
        }
    }
  };
}    

// Submit username/password to login
var submit = document.getElementById('submit_btn');
submit.onclick = function () { 
    
    // Create a request object
    var request = new XMLHttpRequest();
    
    // Capture the response and store it in a variable
    request.onreadystatechange = function () {
      if (request.readyState === XMLHttpRequest.DONE) {
           // Take some action
           if (request.status === 200) {
              alert('Logged in successfully');
              } else if (request.status === 403) {
                  alert('Username/passsword is incorrect');
              } else if(request.status === 500) { 
                  alert('Something went wrong on the server');
              }
      }
      // Not done yet
   };
    
   // Make the request
   var username = document.getElementById('username').value;
   var password = document.getElementById('password').value;
   console.log('username');
   console.log('password');
   request.open('POST', 'http://kinzah.imad.hasura-app.io/login', true);
   request.setRequestHeader('Content-Type', 'application/json');
   request.send(JSON.stringify({username: username, password: password}));
   
};

loadLogin();

// Now this is something that we could have directly done on the server-side using templating too!
loadArticles();
