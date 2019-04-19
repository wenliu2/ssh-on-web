const store = {
  auth: {
    isLogin: false,
    token: "",
    tokenExpired: false,
    nt: "",
    login(nt) {
      this.isLogin = true;
      this.nt = nt;
      console.log("this:", this);
    },
    logout() {
      this.isLogin = false;
      this.nt = "";
    },
    setToken(newValue) {
      this.token = newValue;
    },
    clearToken() {
      this.token = "";
    },
    expired() {
      this.tokenExpired = true;
      this.clearToken();
      this.logout();
    }
  },
  state: {

  }
};

export default store;
