<template>
<q-layout background="secondary">
  <q-layout-container>
    <q-page padding>
      <div float-right>
        <q-input class="inputLogin" stack-label="Email" type="email"/>
        <q-input class="inputLogin" stack-label="Senha" type="password"/>
        <q-btn @click="login()" color="primary" class="btn-login" flat right label="Login"/>
      </div>
    </q-page>
  </q-layout-container>
</q-layout>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {};
  },
  methods: {
    login() {
      let loginModel = {
        username: "gustavoglu@hotmail.com",
        password: "giroldinhufenix",
        grant_type: "password"
      };
      let uri = "http://si.accist.com.br/token";
      let config = {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        //body: loginModel
      }
      axios.post(uri, loginModel,config)
      .then(function(response) {
        alert(JSON.stringify(response));
        let data = response.data;
        let token = data.access_token;
      })
      .catch(function(error){
      alert(error)
    })
  }
 }
}
</script>

<style>
.inputLogin {
  margin: 10px;
}

.btn-login {
  width: 100%;
  margin: 10px;
}
</style>
