<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header :props="teste">
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
        <q-list-header>Olá</q-list-header>
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
  methods: {
    openURL,
    getUserName() {
      let username = LocalStorage.item.get("username");
      if (!username) return "";
      return "Olá " + username;
    },
    logout() {
      let accessToken = LocalStorage.remove("accessToken");
      window.location = "/login";
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
