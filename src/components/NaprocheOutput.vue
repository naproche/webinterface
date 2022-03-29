<template>
  <div class="naprocheOut">
    <div v-if="!lines.length && running">
      <p>parsing ....</p>
    </div>
    <div v-else>
      <p v-for="line of lines" :key="line.id" :class="[line.type]">
        {{ line.line }}
      </p>
    </div>
  </div>
</template>

<style scoped>
p {
  text-align: left;
  font-family: monospace;
  line-height: 1.15;
  font-size: 1em;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  padding: 0;
}

.error {
  text-decoration: underline red;
}
</style>

<script>
import { FetchLibraryGithub } from "@/store/index.js";

export default {
  name: "NaprocheOutput",
  props: {
    args: Array,
    fetchUser: Function
  },
  data() {
    return {
      lines: [],
      running: false,
      prover: undefined,
      naproche: undefined,
      proverOut: [],
      proverErr: []
    };
  },
  watch: {
    args: {
      deep: true,
      handler(args) {
        console.log("Naproche activated!");
        if (this.naproche !== undefined) {
          this.naproche.terminate();
        }
        if (args === []) {
          return;
        }
        this.lines = [];
        this.runNaproche();
      }
    }
  },
  methods: {
    runNaproche() {
      this.running = true;
      this.naproche = new Worker("naproche.js");
      const send = msg => this.naproche.postMessage(msg);
      send(""); // Start Naproche
      this.naproche.onmessage = msg => {
        console.log(msg.data);
        if (msg.data.Req === "config") {
          // This is likely a bug in vue js.
          // When the args prop is dynamic, it becomes a proxy
          // and we have to extract the data out of it.
          const argsObj = Object.assign({}, this.args);
          var args = [];
          for (var a in argsObj) {
            args.push(argsObj[a]);
          }
          this.$store.commit("addLibraryFile", {
            name: "init.opt",
            content: initOpt
          });
          send({ args: args });
        }
        if (msg.data.Req === "output") {
          const out = msg.data.Msg.split("\n").map(l => {
            return { type: "output", line: l ? l : " " };
          });
          this.lines = this.lines.concat(out);
        }
        if (msg.data.Req === "library") {
          this.$store
            .dispatch("loadFile", {
              name: msg.data.FileName,
              fetchUser: this.fetchUser,
              ...FetchLibraryGithub
            })
            .then(() => {
              const content = this.$store.getters.readFile(msg.data.FileName);
              if (content === null) {
                this.file = "Couldn't load file: " + msg.data.FileName;
              } else {
                send({ fileContent: content });
              }
            });
        }
        if (msg.data.Req === "prover") {
          this.prover.postMessage({ Task: msg.data.Task, Args: msg.data.Args });
        }
      };
      this.prover.onmessage = msg => {
        console.log(msg.data);
        if (msg.data.Req === "proverOut") {
          if (msg.data.content.startsWith("program exited")) {
            return;
          } else if (msg.data.content === "Calling stub instead of signal()") {
            return;
          } else {
            if(msg.data.Req.error) {
              this.proverErr.push(msg.data.content);
            } else {
              this.proverOut.push(msg.data.content);
            }
          }
        }
        if (msg.data.Req === "proverDone") {
          const outObj = Object.assign({}, this.proverOut);
          var proverOut = [];
          for (var a in outObj) {
            proverOut.push(outObj[a]);
          }
          const errObj = Object.assign({}, this.proverErr);
          var proverErr = [];
          for (a in errObj) {
            proverErr.push(errObj[a]);
          }
          this.proverOut = [];
          this.proverErr = [];
          console.log(proverOut);
          send({ proverOut: proverOut, proverErr: proverErr });
        }
      };
    }
  },
  mounted() {
    this.prover = new Worker("spass.js");
    if (this.args !== []) {
      this.lines = [];
      this.runNaproche();
    }
  },
  beforeUnmount() {
    this.prover.terminate();
  }
};

const initOpt = `
[checkconsistency off]
`;
</script>
