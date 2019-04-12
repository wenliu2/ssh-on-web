const store = {
  auth: {
    isLogin: false,
    token: "",
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
    }
  },
  state: {

  }
};

export default store;
