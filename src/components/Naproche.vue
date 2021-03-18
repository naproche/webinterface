<template>
  <div class="naprocheOut">
    <pre>{{ file }}</pre>
  </div>
</template>

<style scoped>
pre {
   text-align: left;
}
</style>

<script>
import { FetchLibraryGithub } from '@/store/index.js';

export default {
  name: "Naproche",
  props:  {
      args: Array,
      fetchUser: Function
  },
  data() {
    return {
      file: "",
      prover: undefined,
      naproche: undefined,
      proverOut: ""
    }
  },
  mounted() {
    this.prover = new Worker('prover.js');
    this.naproche = new Worker('frontend.jsexe/all.js');
    const send = (msg) => this.naproche.postMessage(msg);
    send(""); // Start Naproche
    this.naproche.onmessage = (msg) => {
        console.log(msg.data);
        if (msg.data.Req === "config") {
        send({ args: this.args, initFile: initOpt, proversFile: proversJson });
        }
        if (msg.data.Req === "output") {
        this.file = this.file + msg.data.Msg + '\n';
        }
        if (msg.data.Req === "error") {
        this.file = this.file + msg.data.Msg + '\n';
        }
        if (msg.data.Req === "library") {
        this.$store.dispatch('loadFile', {
            name: msg.data.FileName,
            fetchUser: this.fetchUser,
            ...FetchLibraryGithub,
        }).then(() => {
            const content = this.$store.getters.readFile(msg.data.FileName);
            if (content === null) {
                this.file = "Couldn't load file: " + msg.data.FileName;
            } else {
                send({ fileContent: content });
            }
        });
        }
        if (msg.data.Req === "read") {
            this.$store.dispatch('retrieve', msg.data.FileName).then(resp => {
                if(resp !== undefined) {
                    resp.text().then(txt => {
                        send({ cacheContent: txt });
                    });
                } else {
                    send({ cacheContent: "" });
                }
            });
        }
        if (msg.data.Req === "write") {
            this.$store.dispatch('store', {
                req: msg.data.FileName,
                resp: new Response(msg.data.FileContent)
            });
        }
        if (msg.data.Req === "prover") {
           this.prover.postMessage({ Task: msg.data.Task, Args: msg.data.Args })
        }
    };
    this.prover.onmessage = (msg) => {
        console.log(msg.data);
        if (msg.data.Req === "proverOut") {
           if (msg.data.content !== "Calling stub instead of signal()") {
              this.proverOut = this.proverOut + msg.data.content + '\n';
           }
        }
        if (msg.data.Req === "proverDone") {
           const proverOut = this.proverOut;
           this.proverOut = "";
           send({ proverOut: proverOut });
        }
    }
  },
  beforeUnmount() {
      this.prover.terminate();
      this.naproche.terminate();
  }
};


const initOpt = `
[library examples]
[provers provers.json]
[prover eprover]
[timelimit 3]
[depthlimit 7]
[checktime 1]
[checkdepth 3]
[prove on]
[check on]
[symsign on]
[info on]
[thesis on]
[filter on]
[skipfail off]
[flat off]
[printgoal on]
[printreason off]
[printsection off]
[printcheck off]
[printprover off]
[printunfold off]
[printfulltask off]
[tex off]
`

const proversJson = `
[
   {
      "name": "eprover",
      "label": "eprover",
      "path": "eprover",
      "arguments": [
         "--auto",
         "-s",
         "--memory-limit=%m",
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
      "unknownMessage": [
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
      "unknownMessage": [
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
      "unknownMessage": [
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
      "unknownMessage": [
         "% SZS status Timeout for"
      ]
   }
]
`
</script>
