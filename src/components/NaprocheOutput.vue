<template>
  <div class="naprocheOut">
    <div v-if="parsing">
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
  data() {
    return {
      lines: [],
      activeProver: undefined,
      naproche: undefined,
      parsing: false,
      provers: {},
      proverOut: [],
      proverErr: []
    };
  },
  methods: {
    runNaproche(args, fetchUser, chooseProver) {
      if (this.naproche !== undefined) {
        this.naproche.terminate();
      }
      this.lines = [];
      this.parsing = true;
      this.activeProver = this.provers[chooseProver];
      this.naproche = new Worker("naproche.js");
      const send = msg => this.naproche.postMessage(msg);
      send(""); // Start Naproche
      this.naproche.onmessage = msg => {
        if (msg.data.Req === "config") {
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
          this.parsing = false;
        }
        if (msg.data.Req === "library") {
          this.$store
            .dispatch("loadFile", {
              name: msg.data.FileName,
              fetchUser: fetchUser,
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
          this.activeProver.postMessage({ Task: msg.data.Task, Args: msg.data.Args });
        }
      };
      this.activeProver.onmessage = msg => {
        if (msg.data.Req === "proverOut") {
          if (msg.data.content) {
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
          } else if (msg.data.html) {
            const doc = new DOMParser().parseFromString(msg.data.html, 'text/html');
            const out = doc.querySelector('pre').innerHTML.split('\n');
            for(let line in out) {
              this.proverOut.push(out[line]);
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
          send({ proverOut: proverOut, proverErr: proverErr });
        }
      };
    }
  },
  mounted() {
    this.provers["spass"] = new Worker("spass.js");
    this.provers["eprover"] = new Worker("eprover.js");
    this.provers["vampire"] = new Worker("vampire.js");
  },
  beforeUnmount() {
    this.naproche.terminate();
    this.provers["spass"].terminate();
    this.provers["eprover"].terminate();
    this.provers["vampire"].terminate();
  }
};

const initOpt = `
[checkconsistency off]
`;
</script>
