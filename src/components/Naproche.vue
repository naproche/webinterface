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
  font-family: monospace, monospace;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.error {
  text-decoration: underline red;
}
</style>

<script>
import { FetchLibraryGithub } from "@/store/index.js";

export default {
  name: "Naproche",
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
      proverOut: ""
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
          send({ args: args, initFile: initOpt, proversFile: proversJson });
        }
        if (msg.data.Req === "output") {
          const out = msg.data.Msg.split("\n").map(l => {
            return { type: "output", line: l ? l : " " };
          });
          this.lines = this.lines.concat(out);
        }
        if (msg.data.Req === "error") {
          const out = msg.data.Msg.split("\n").map(l => {
            return { type: "error", line: l };
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
        if (msg.data.Req === "read") {
          this.$store.dispatch("retrieve", msg.data.FileName).then(resp => {
            if (resp !== undefined) {
              resp.text().then(txt => {
                send({ cacheContent: txt });
              });
            } else {
              send({ cacheContent: "" });
            }
          });
        }
        if (msg.data.Req === "write") {
          this.$store.dispatch("store", {
            req: msg.data.FileName,
            resp: new Response(msg.data.FileContent)
          });
        }
        if (msg.data.Req === "prover") {
          this.prover.postMessage({ Task: msg.data.Task, Args: msg.data.Args });
        }
      };
      this.prover.onmessage = msg => {
        console.log(msg.data);
        if (msg.data.Req === "proverOut") {
          if (msg.data.content !== "Calling stub instead of signal()") {
            this.proverOut = this.proverOut + msg.data.content + "\n";
          }
        }
        if (msg.data.Req === "proverDone") {
          const proverOut = this.proverOut;
          this.proverOut = "";
          send({ proverOut: proverOut });
        }
      };
    }
  },
  mounted() {
    this.prover = new Worker("spass.js");
  },
  beforeUnmount() {
    this.prover.terminate();
  }
};

const initOpt = `
[library examples]
[provers provers.json]
[prover eprover]
[timelimit 3]
[prove on]
[check on]
[skipfail off]
[printgoal on]
[printprover off]
[tex off]
`;

const proversJson = `
[
   {
      "name": "eprover",
      "label": "eprover",
      "path": "eprover",
      "arguments": [
         "--auto",
         "-s",
         "--memory-limit=1024",
         "--cpu-limit=%t"
      ],
      "successMessage": [
         "# SZS status Theorem"
      ],
      "contradictionMessage": [
         "# SZS status ContradictoryAxioms"
      ],
      "failureMessage": [
         "# SZS status CounterSatisfiable"
      ],
      "resourceOutMessage": [
         "# SZS status ResourceOut",
         "# SZS status GaveUp"
      ]
   },
   {
      "name": "eproververb",
      "label": "eproververb",
      "path": "eprover",
      "arguments": [
         "-xAuto",
         "-tAuto",
         "-mAuto",
         "--tstp-in",
         "-l",
         "2",
         "--cpu-limit=%t",
         "--memory-limit=%m"
      ],
      "successMessage": [
         "# SZS status Theorem"
      ],
      "contradictionMessage": [
         "# SZS status ContradictoryAxioms"
      ],
      "failureMessage": [
         "# SZS status CounterSatisfiable"
      ],
      "resourceOutMessage": [
         "# SZS status ResourceOut",
         "# SZS status GaveUp"
      ]
   },
   {
      "name": "spass",
      "label": "SPASS",
      "path": "SPASS",
      "arguments": [
         "-TPTP",
         "-CNFOptSkolem=0",
         "-PProblem=0",
         "-PGiven=0",
         "-TimeLimit=%t"
      ],
      "successMessage": [
         "SPASS beiseite: Proof found."
      ],
      "contradictionMessage": [],
      "failureMessage": [
         "SPASS beiseite: Completion found."
      ],
      "resourceOutMessage": [
         "SPASS beiseite: Ran out of time."
      ]
   },
   {
      "name": "vampire",
      "label": "vampire",
      "path": "vampire4.2.2",
      "arguments": [
         "--mode",
         "casc",
         "-t %t"
      ],
      "successMessage": [
         "% SZS output end Proof for"
      ],
      "contradictionMessage": [],
      "failureMessage": [
         "% SZS status CounterSatisfiable for"
      ],
      "resourceOutMessage": [
         "% SZS status Timeout for"
      ]
   }
]
`;
</script>
