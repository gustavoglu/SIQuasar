<template>
<q-layout class="layout"  background="secondary">
 
    <q-page padding>
      <div class="column fixed-center">
        <img class="q-ma-lg col-5 col-md-auto"  src="statics/logoaccist320.png">
        <q-input class="q-ma-sm col-5 col-md-auto" color="secondary" name="username" v-model="loginModel.username" stack-label="Email" type="email"/>
        <q-input class="q-ma-sm col-5 col-md-auto" color="secondary" name="password" v-model="loginModel.password" stack-label="Senha" type="password"/>
        <q-btn class="q-ma-sm col-5 col-md-auto" :disable="loginModel.username.length == 0 || loginModel.password.length == 0"  @click="login()" color="secondary"   label="Login"/>
      </div>
    </q-page>
 
</q-layout>
</template>

<script>
import axios from "axios";
import qs from "qs";
import {
  Notify,
  Loading,
  QSpinnerGears,
  LocalStorage,
  SessionStorage
} from "quasar"
export default {
  data() {
    return {
      loginModel: {
        username: "",
        password: "",
        grant_type: "password"
      }
    };
  },
  mounted: function() {
    let self = this;
    let username = LocalStorage.get.item("username");
    if (username) self.loginModel.username = username;
  },
  methods: {
    login() {
      Loading.show()
      let self = this;
      let uri = "http://si.accist.com.br/token";

      let config = {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      };

      axios
        .post(uri, qs.stringify(self.loginModel), config)
        .then(function(response) {
          let notify = {
            type: "positive",
            message: "Logado",
            position: "top"
          };

          Notify.create(notify);

          let data = response.data;
          let username = self.loginModel.username;
          let access_token = data.access_token;

          LocalStorage.set("username", username);
          LocalStorage.set("accessToken", access_token);
          LocalStorage.set("expires", data['.expires']);

          self.$router.push("/");
          Loading.hide();
        })
        .catch(function(error) {
          let notify = {
            type: "warning",
            message: "Não foi possivel se logar, verifique seu usuario e senha",
            position: "top"
          };

          Notify.create(notify);

          Loading.hide();
        });
    },
    loading(show) {
      let self = this
      if (show) Loading.show()
      Loading.hide();
    }
  }
};
</script>

<style lang="stylus">
.layout {
  padding: 20px, 
  background = 'black';
}

.inputLogin {
  margin: 10px;
}

.btn-login {
  width: 100%;
  margin: 10px;
}
body{
  background :'black'
}
</style>
