<template>
  <div>
    <input class="username" v-model="username" placeholder="Username" />
    <input class="repository" v-model="repository" placeholder="Repository" />
    <input class="branch" v-model="branch" placeholder="Branch" />
    <input class="filename" v-model="filename" placeholder="Filename" />
    <button @click="sync()">Sync</button>
    <div style="float: right">
      <button @click="translate()">Translate</button>
      <button @click="load()">Check</button>
    </div>
  </div>
  <div class="naproche-output-wrapper">
    <Naproche :args="args" :fetchUser="fetchUser" />
  </div>
</template>

<style scoped>
.naproche-output-wrapper {
  padding: 5%;
  width: 90%;
}

.username,
.repository,
.branch {
  width: 10em;
}

.filename {
  width: 20em;
}
</style>

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
      return fetchUserGithub(
        this.$route.params.username,
        this.$route.params.repository,
        this.$route.params.branch
      ).fetchUser;
    }
  },
  created() {
    this.$watch(
      () => this.$route.params,
      toParams => {
        (this.username = toParams.username),
          (this.repository = toParams.repository),
          (this.branch = toParams.branch),
          (this.filename = toParams.filename);
      }
    );
  },
  methods: {
    load() {
      this.updateUrl();
      this.args = ["--fof=on", "--prover=spass", this.$route.params.filename];
    },
    translate() {
      this.updateUrl();
      this.args = [
        "-T",
        "--fof=on",
        "--prover=spass",
        this.$route.params.filename
      ];
    },
    sync() {
      this.updateUrl();
      this.$store.commit("cleanUserFiles");
    },
    updateUrl() {
      this.$router.push({
        name: "Github",
        params: {
          username: this.username,
          repository: this.repository,
          branch: this.branch,
          filename: this.filename
        }
      });
    }
  },
  data() {
    return {
      args: [],
      username: this.$route.params.username,
      repository: this.$route.params.repository,
      branch: this.$route.params.branch,
      filename: this.$route.params.filename
    };
  }
};
</script>
