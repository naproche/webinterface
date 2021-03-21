<template>
  <div class="github">
    <input v-model="username" />
    <input v-model="repository" />
    <input v-model="branch" />
    <input v-model="filename" />
    <button v-on:click="loaded = !loaded">
      {{ loaded ? "Unload" : "Load" }}
    </button>
    <Naproche
      v-if="loaded"
      :args="['--fof=on', '--prover=spass', filename]"
      :fetchUser="fetchUser"
    />
  </div>
</template>

<script>
import { fetchUserGithub } from "@/store/index.js";
import Naproche from "@/components/Naproche.vue";

export default {
  name: "Github",
  components: {
    Naproche
  },
  computed: {
    fetchUser() {
      return fetchUserGithub(this.username, this.repository, this.branch)
        .fetchUser;
    }
  },
  data() {
    return {
      loaded: false,
      username: "naproche-community",
      repository: "naproche",
      branch: "refactor-backend",
      filename: "examples/geometry/formalization.ftl.tex"
    };
  }
};
</script>
