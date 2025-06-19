<script setup></script>

<template>
  <v-app>
    <v-app-bar app color ="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title></v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style scoped></style>
