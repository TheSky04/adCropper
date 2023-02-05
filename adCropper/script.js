"use strict";

class App {
  sectionAnimations = document.querySelector(".animations");
  sectionSecond = document.querySelector(".section--second");
  sectionRegister = document.querySelector(".register");
  sectionLogin = document.querySelector(".login");
  sectionforgotPassword = document.querySelector(".forgot--password");
  sectionPlugins = document.querySelector(".plugins");

  alreadyBtn = document.querySelector(".already--button");
  forgotBtn = document.querySelector(".forgot");

  leftArrow = document.querySelector(".left-arrow");

  registerForm = document.querySelector(".register--form");
  loginForm = document.querySelector(".login--form");
  forgotForm = document.querySelector(".forgot--form");

  cta = document.querySelector(".cta");
  popupButton = document.querySelector(".popup--button");

  constructor() {
    this.alreadyBtn.addEventListener(
      "click",
      this.showLoginCloseRegister.bind(this)
    );
    this.forgotBtn.addEventListener(
      "click",
      this.closeLoginopenForgotPassword.bind(this)
    );
    this.leftArrow.addEventListener(
      "click",
      this.closeForgotPasswordOpenRegister.bind(this)
    );
    this.registerForm.addEventListener("submit", this.createAccount.bind(this));
    this.sectionRegister.addEventListener(
      "click",
      this.closeErrorMessage.bind(this)
    );
    this.sectionLogin.addEventListener(
      "click",
      this.closeErrorMessage.bind(this)
    );
    this.sectionforgotPassword.addEventListener(
      "click",
      this.closeErrorMessage.bind(this)
    );
    this.loginForm.addEventListener("submit", this.checkForm.bind(this));
    this.forgotForm.addEventListener("submit", this.changePassword.bind(this));
    this.cta.addEventListener("click", this.showCSSPlugins.bind(this));
    this.popupButton.addEventListener("click", this.showPopupList.bind(this));
  }

  showPopupList() {
    const popupList = document.querySelector(".popup--list");
    popupList.classList.toggle("hidden-opacity");
  }

  showLoginCloseRegister() {
    this.sectionLogin.classList.remove("hidden");
    this.sectionRegister.classList.add("hidden");
  }

  closeLoginopenForgotPassword() {
    this.sectionLogin.classList.add("hidden");
    this.sectionforgotPassword.classList.remove("hidden");
  }

  closeForgotPasswordOpenRegister() {
    this.sectionforgotPassword.classList.add("hidden");
    this.sectionRegister.classList.remove("hidden");
  }

  validation(...values) {
    let isValid = true;
    if (values.some((value) => value.trim().length === 0)) {
      isValid = false;
      return;
    }

    return isValid;
  }

  renderError(parentElement, err) {
    let html = `
    <section class="errorMessage">
      <p class="errorMessage--text">${err}</p>
      <p class="times">&times;</p>
    </section>
    `;
    parentElement.insertAdjacentHTML("afterbegin", html);
  }

  closeErrorMessage(e) {
    if (e.target.classList.contains("times")) {
      const errorEl = e.target.closest(".errorMessage");
      errorEl.remove();
    }
  }

  async sendData(data) {
    const postData = await fetch(
      "https://react-http-8ec08-default-rtdb.firebaseio.com/users.json",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async getUsers() {
    const response = await fetch(
      "https://react-http-8ec08-default-rtdb.firebaseio.com/users.json"
    );
    const data = await response.json();

    const users = [];

    for (const key in data) {
      users.push({
        id: key,
        email: data[key].email,
        password: data[key].password,
      });
    }

    return users;
  }

  async createAccount(e) {
    try {
      e.preventDefault();
      const inputEmail = document.querySelector(".register--email");
      const inputPassword = document.querySelector(".register--password");
      const email = inputEmail.value;
      const password = inputPassword.value;
      if (!this.validation(email, password)) return;
      const users = await this.getUsers();
      if (users.some((user) => user.email === email)) {
        throw new Error("This username is already valid.");
      }
      this.sendData({ email, password });
      this.showLoginCloseRegister();
    } catch (err) {
      this.renderError(this.sectionRegister, err.message);
    }
  }

  loggedIn() {
    this.sectionLogin.classList.add("hidden");
    this.sectionAnimations.classList.remove("hidden");
    this.sectionSecond.classList.remove("hidden");
    this.sectionPlugins.classList.remove("hidden");
  }

  clearInputs() {
    this.forgotForm.reset();
    this.registerForm.reset();
  }

  async checkForm(e) {
    try {
      e.preventDefault();
      const emailInput = document.querySelector(".login--email");
      const passwordInput = document.querySelector(".login--password");
      const checkboxInput = document.querySelector(".login--checkbox");

      const users = await this.getUsers();
      if (!users.some((user) => user.email === emailInput.value)) {
        throw new Error("This e-mail is not valid.");
        return;
      }
      const currentUser = users.find((user) => user.email === emailInput.value);
      if (currentUser.password !== passwordInput.value) {
        throw new Error("Wrong password!");
        return;
      }
      if (!checkboxInput.checked) {
        this.loginForm.reset();
      }

      this.loggedIn();
    } catch (err) {
      this.renderError(this.sectionLogin, err.message);
    }
  }

  async changePassword(e) {
    try {
      e.preventDefault();
      const emailInput = document.querySelector(".forgot--email");
      const passwordInput = document.querySelector(".forgot--password--input");
      const repasswordInput = document.querySelector(
        ".forgot--repassword--input"
      );
      const users = await this.getUsers();
      const currentUser = users.find((user) => user.email === emailInput.value);
      if (!currentUser) throw new Error("There is no such a user!");
      if (passwordInput.value !== repasswordInput.value)
        throw new Error("Password and Repassword field must be the same!");
      throw new Error("Bir hata oluştu.");
    } catch (err) {
      this.renderError(this.sectionforgotPassword, err.message);
    }
  }

  async updateUser(id, data) {
    const response = await fetch(
      `https://react-http-8ec08-default-rtdb.firebaseio.com/users/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
  }

  showCSSPlugins() {
    this.sectionSecond.classList.add("hidden");
    this.sectionAnimations.classList.add("hidden");
    this.sectionPlugins.classList.remove("hidden");
  }
}

const app = new App();
