<template>
  <Split :initRatio="0.5" :min-left="0.2" :min-right="0.1">
    <template v-slot:left>
      <div class="left-flex">
        <div>
          <div style="float: left">
            <button @click="usetex = !usetex">
              {{ usetex ? "Tex" : "Ftl" }}
            </button>
          </div>
          <div style="float: right">
            <button @click="translate()">Translate</button>
            <button @click="load()">Check</button>
          </div>
        </div>
        <textarea v-model="stdin"></textarea>
      </div>
    </template>
    <template v-slot:right>
      <div class="naproche-output-wrapper">
        <Naproche :args="args" :fetchUser="fetchUser" />
      </div>
    </template>
  </Split>
</template>

<style scoped>
.left-flex {
  display: flex;
  flex-direction: column;
  height: 100%;
}

textarea {
  width: 100%;
  box-sizing: border-box;
  border: 0;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.naproche-output-wrapper {
  padding: 5%;
  width: 90%;
}
</style>

<script>
import Naproche from "@/components/Naproche.vue";
import Split from "@/components/Split.vue";

export default {
  name: "Text",
  components: {
    Naproche,
    Split
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
    },
    hastex() {
      return this.usetex ? "on" : "off";
    }
  },
  methods: {
    load() {
      this.$store.commit("addUserFile", {
        name: "textarea.ftl",
        content: this.stdin
      });
      this.args = [
        "--tex=" + this.hastex,
        "--fof=on",
        "--prover=spass",
        "textarea.ftl"
      ];
    },
    translate() {
      this.$store.commit("addUserFile", {
        name: "textarea.ftl",
        content: this.stdin
      });
      this.args = [
        "-T",
        "--tex=" + this.hastex,
        "--fof=on",
        "--prover=spass",
        "textarea.ftl"
      ];
    }
  },
  data() {
    return {
      loaded: false,
      usetex: false,
      args: [],
      stdin: ""
    };
  }
};
</script>
