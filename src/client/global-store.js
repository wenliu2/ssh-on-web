const store = {
  auth: {
    isLogin: false,
    token: "",

    login() {
      console.log("this:", this);
      this.isLogin = true;
    },
    logout() {
      this.isLogin = false;
    },
    setToken(newValue) {
      this.token = newValue;
    },
    clearToken() {
      this.token = "";
    }
  },
  state: {

  }
};

export default store;
