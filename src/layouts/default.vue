<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="secondary"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          {{title}}
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>{{OlaUserName}}</q-list-header>
        <q-item @click.native='logout()'>
          <q-item-side icon="power settings new" />
          <q-item-main label="Logout"/>
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL, LocalStorage } from "quasar";

export default {
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      title: "ACCIST SI"
      // props: [title],
    };
  },
  computed:{
    OlaUserName() {
      let username = LocalStorage.get.item("username");
      if (!username) return "Olá";
      return "Olá " + username;
    },
  },
  methods: {
    openURL,
    getUserName() {
      let username = LocalStorage.get.item("username");
      if (!username) return "";
      return "Olá " + username;
    },
    logout() {
      let accessToken = LocalStorage.remove("accessToken");
      this.$router.push("/login");
    }
  },
  created: function() {
    this.$root.$on("titulo", titulo => {
      this.title = titulo;
    });
  }
  //mounted:function(){
  //  //let self = this;
  //  //props['title']= 'ACCIST SI'
  //
  //}
};
</script>

<style>
</style>
