$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const appId = urlParams.get('AppId');
    console.log(appId); // will output "2"
    $('#login').submit(function(e) {
      e.preventDefault();
      var username = $('input[name="username"]').val();
      var password = $('input[name="password"]').val();

      // console.log(tokenDetails)
      $.ajax({
        type: 'POST',
        url: `/api/login${window.location.search}`,
        data: {
          "username": username,
          "password": password,
          "AppId":appId
        },
        success: function(data) {
          if(data.code == 200){
            console.log(JSON.stringify(data));
            let serverUrl = decodeURIComponent(data.redirectUrl+"?token="+data.token)
            console.log(`serverUrl ${serverUrl}`)
            window.location.href = serverUrl;   
          }else if(data.code == 404){
            $("#message").text(data.message);
          }
        },
        error:function(error){
          console.log(`Error ${error}`)
        }
      });
    });
  });

function togglePasswordVisibility() {
    var passwordInput = document.getElementById("password");
    var passwordToggleIcon = document.querySelector(".password-toggle-icon i");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      passwordToggleIcon.classList.remove("fa-eye");
      passwordToggleIcon.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      passwordToggleIcon.classList.remove("fa-eye-slash");
      passwordToggleIcon.classList.add("fa-eye");
    }
  }