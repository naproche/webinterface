<template>
  <div class="text">
    <textarea v-model="stdin"></textarea>
    <button @click="load()">{{ loaded ? "Stop" : "Run" }}</button>
    <Naproche
      v-if="loaded"
      :args="['--fof=on', '--prover=spass', 'stdin.ftl']"
      :fetchUser="fetchUser"
    />
  </div>
</template>

<script>
import Naproche from "@/components/Naproche.vue";

export default {
  name: "Text",
  components: {
    Naproche
  },
  computed: {
    fetchUser() {
      return filename => {
        if (filename === "stdin.ftl") {
          return new Response(this.stdin, { status: 200 });
        } else {
          return null;
        }
      };
    }
  },
  methods: {
    load() {
      this.$store.commit("addUserFile", {
        name: "stdin.ftl",
        content: this.stdin
      });
      this.loaded = !this.loaded;
    }
  },
  data() {
    return {
      loaded: false,
      stdin: ""
    };
  }
};
</script>
