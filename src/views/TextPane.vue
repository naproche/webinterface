<template>
  <div class="text-wrap">
    <MenuBar :onTranslate="translate" :onCheck="load" :showFormatToggle="true"
      :onFormatChange="function(t) { if(t == 'ftl') { usetex = false; } else { usetex = true; } }"
      :onLoadFile="loadFile" />
    <SplitPanes style="flex: 1" :initRatio="0.5" :min-left="0.2" :min-right="0.1">
      <template v-slot:left>
        <div class="left-flex">
          <div id="naproche-text-wrapper">
            <textarea id="naproche-text" v-model="stdin"></textarea>
          </div>
        </div>
      </template>
      <template v-slot:right>
        <div id="right-wrapper">
          <div v-if="showhome">
            <div id="home-screen">
              <h1>Naproche</h1>
              <p>
                Naproche (short for 'Natural proof checking') is a proof assistant that
                accepts controlled natural language as input. It can translate this
                input to first order logic and check it with an automatic theorem prover.
                The latest development version can be found on
                <a href="https://github.com/naproche/naproche/">Github</a>
                and a recent stable version is part of the
                <a href="https://isabelle.in.tum.de/">Isabelle 2021-1</a> distribution.
              </p>
              <p>
                You can directly start writing Naproche texts on the left or load an example from the menu.
                <!--We offer two provers: the SPASS prover runs locally in the browser, while the
                more powerful eprover runs on the <a href="http://www.tptp.org/cgi-bin/SystemOnTPTP">System On TPTP</a>. We recommend the eprover for
                the best experience, but please use this community-provided resource responsibly.-->
                For longer-term use, we recomend the Isabelle version (which is also much faster).
              </p>
              <p>Enjoy!</p>
            </div>
          </div>
          <div v-else>
            <div class="naproche-output-wrapper">
              <NaprocheOutput :args="args" :fetchUser="fetchUser" />
            </div>
          </div>
        </div>
      </template>
    </SplitPanes>
  </div>
</template>

<style scoped>
.text-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.left-flex {
  display: flex;
  flex-direction: column;
  height: 100%;
}

#right-wrapper {
  height: 100%;
}

#home-screen {
  padding: 2em;
  text-align: justify;
}

#naproche-text-wrapper {
  width: 100%;
  box-sizing: border-box;
  border: 0;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  flex-direction: column;
  display: flex;
}

.naproche-output-wrapper {
  padding: 2em;
}
</style>

<script>
import NaprocheOutput from "@/components/NaprocheOutput.vue";
import SplitPanes from "@/components/SplitPanes.vue";
import MenuBar from "@/views/MenuBar.vue";
import CodeMirror from "codemirror";

export default {
  name: "TextPane",
  components: {
    NaprocheOutput,
    MenuBar,
    SplitPanes
  },
  mounted: function() {
    var scope = this;
    
    var textarea = document.getElementById('naproche-text');
    this.editor = CodeMirror.fromTextArea(textarea, {
      lineNumbers: true,
      mode: null
    });
    this.editor.display.wrapper.style['flex-grow'] = '1';
    
    this.editor.on('change', function(cm) {
      scope.stdin = cm.getValue();
    });
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
      this.showhome = false;
      this.$store.commit("addUserFile", {
        name: "textarea.ftl",
        content: this.stdin
      });
      this.args = [
        "--tex=" + this.hastex,
        "--prover=spass",
        "textarea.ftl"
      ];
    },
    translate() {
      this.showhome = false;
      this.$store.commit("addUserFile", {
        name: "textarea.ftl",
        content: this.stdin
      });
      this.args = [
        "-T",
        "--tex=" + this.hastex,
        "--prover=spass",
        "textarea.ftl"
      ];
    },
    async loadFile(url) {
      let response = await fetch(url);
      if (response && response.status === 200) {
        let content = await response.text();
        this.editor.getDoc().setValue(content);
      }
    }
  },
  data() {
    return {
      loaded: false,
      usetex: false,
      showhome: true,
      editor: {},
      args: [],
      stdin: ""
    };
  }
};
</script>
