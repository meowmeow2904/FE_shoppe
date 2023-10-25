
let baseUrlAuth = "http://localhost:8888/api/v1/auth";

function Account(username, password) {
  this.username = username;
  this.password = password;
}

function AccountSignUp(username, password, fullName, dateOfBirth, phoneNumber, avatar) {
  this.username = username;
  this.password = password;
  this.fullName = fullName;
  this.dateBirth = dateOfBirth;
  this.phoneNumber = phoneNumber;
  this.avatar = avatar;
}

function signUp() {
  event.preventDefault()
  let username = document.getElementById("username-su").value;
  let password = document.getElementById("password-su").value;
  let fullName = document.getElementById("fullName-su").value;
  let dateOfBirth = document.getElementById("dateOfBirth-su").value;
  let phoneNumber = document.getElementById("phoneNumber-su").value;
  let avatar = document.getElementById("avatar-su").value;

  let account = new AccountSignUp(username, password, fullName, dateOfBirth, phoneNumber, avatar);

  //   ------------------------------------- CALL API ĐĂNG KÝ -------------------------------------
    $.ajax({
      url: baseUrlAuth + "/register",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(account),
      error: function (err) {
          console.log(err)
          // confirm(err.responseJSON.message)
          showAlrtFailse(err.responseJSON.message);
      },
      success: function (data) {
          console.log(data)
          // window.location.href = "./index.html"
          window.location.href = "./login.html"
      }
  });
  // window.location.href = "./login.html"
}

function login() {
  event.preventDefault()
  let username = document.getElementById("inputUsername").value;
  let password = document.getElementById("password").value;
  let account = new Account(username, password);
  let param = "?username=" + username +"&password=" + password;
  //   ------------------------------------- API ĐĂNG NHẬP -------------------------------------
  $.ajax({
    url: baseUrlAuth + "/login-jwt" + param,
    type: "POST",
    contentType: "application/json",
    // data: JSON.stringify(account),
    error: function (err) {
      console.log(err)
      // confirm(err.responseJSON.message)
      showAlrtFailse(err.responseJSON.message);
    },
    success: function (data) {
      console.log(data)
      localStorage.setItem("isLogin", true)
      localStorage.setItem("avatar", data.avatar)
      localStorage.setItem("fullName", data.fullName);
      localStorage.setItem("id", data.id);
      localStorage.setItem("role", data.role);
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      window.location.href = "./index.html"
    }
  });
  
  // Fake data bằng file json
  // let checkAccount;
  // fetch('/assets/data/account.json')
  //   .then((response) => response.json())
  //   .then((json) =>
  //     checkLogin(json)
  //   );
  // function checkLogin(json) {
  //   checkAccount = json.find(element => (element.username === username && element.password === password))
  //   console.log(checkAccount)
  //   if (checkAccount) {
  //     localStorage.setItem("fullName", checkAccount.fullName);
  //     localStorage.setItem("id", checkAccount.id);
  //     localStorage.setItem("role", checkAccount.role);
  //     localStorage.setItem("token", checkAccount.token);
  //     localStorage.setItem("username", checkAccount.username);
  //     window.location.href = "./index.html"
  //   } else {
  //     alert("User hoặc mật khẩu ko đúng")
  //   }
  // }


}

function showAlrtFailse(text) {
  document.getElementById("text-su").innerText = text;
  $("#login-failse-alert").fadeTo(5000, 500).slideUp(500, function () {
      $("#login-failse-alert").slideUp(5000);
  });
}
