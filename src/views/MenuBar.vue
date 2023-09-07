<template>
  <div class="main-menu pure-menu pure-menu-horizontal">
    <div class="pure-menu-heading">Naproche</div>
    <ul class="pure-menu-list">
      <li class="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
        <div href="#" id="menuLink1" class="pure-menu-link">Load</div>
        <ul class="pure-menu-children">
          <li class="pure-menu-item" v-for="file in files" :key="file.name">
            <a v-on:click="loadFile(file); false;"
               href="javascript:void(0);" class="pure-menu-link">{{ file.name }}</a>
          </li>
        </ul>
      </li>
      <li class="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
        <div id="menuLink1" class="pure-menu-link">Prover</div>
        <ul class="pure-menu-children">
          <li class="pure-menu-item" v-for="prover in provers" :key="prover.name">
            <a v-on:click="activeProver = prover.name; onProverChange(prover.name); false;"
               href="javascript:void(0);" class="pure-menu-link">{{ prover.description }}
            <i v-if="prover.name == activeProver" class="fa-solid fa-circle-check"></i></a>
          </li>
        </ul>
      </li>
      <li v-if="showFormatToggle" class="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
        <div id="menuLink1" class="pure-menu-link">Format</div>
        <ul class="pure-menu-children">
          <li class="pure-menu-item" v-for="format in formats" :key="format.name">
            <a v-on:click="activeFormat = format.name; changeFormat(format.name); false;"
               href="javascript:void(0);" class="pure-menu-link">{{ format.description }}
            <i v-if="format.name == activeFormat" class="fa-solid fa-circle-check"></i></a>
          </li>
        </ul>
      </li>
    </ul>
    <ul class="pure-menu-list" style="float: right">
      <li class="pure-menu-item">
        <button v-on:click="onTranslate();" class="pure-button">Translate</button>
      </li>
      <li class="pure-menu-item">
        <button v-on:click="onCheck();" class="pure-button pure-button-primary">Check</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.main-menu {
    line-height: normal;
    border-bottom: 1px solid #dddddd;
}

button {
    border-radius: 0;
}
</style>

<script>
export default {
  name: "MenuBar",
  props: {
    onTranslate: Function,
    onCheck: Function,
    changeFormat: Function,
    onProverChange: Function,
    showFormatToggle: Boolean,
    onLoadFile: Function,
  },
  methods: {
    loadFile(file) {
      this.activeFormat = file.format;
      this.changeFormat(file.format);
      this.onLoadFile(file.url);
    },
  },
  data () {
    return {
        activeProver: "spass",
        provers: [
            { name: "spass",
              description: "SPASS (runs in browser)"
            },
            { name: "eprover",
              description: "Eprover (System On TPTP)"
            },
            { name: "vampire",
              description: "Vampire (System On TPTP)"
            }
            ],
        activeFormat: "ftl",
        formats: [
            { name: "ftl",
              description: "Text input (.ftl)"
            },
            { name: "tex",
              description: "LaTeX input (.ftl.tex)"
            }],
        files: [
            { name: "Tutorial (tex)",
              format: "tex",
              url: "https://raw.githubusercontent.com/naproche/naproche/c8c4ca2d5fdb92bf17e0e54c99bd2a9691255d80/examples/TUTORIAL.ftl.tex"
            },
            { name: "Agatha (tex)",
              format: "tex",
              url: "https://raw.githubusercontent.com/naproche/naproche/1d645706c9e44cd8f3f78502132987cde8f1d1c0/examples/agatha.ftl.tex"
            },
            { name: "Cantor (ftl)",
              format: "ftl",
              url: "https://raw.githubusercontent.com/naproche/naproche/1d645706c9e44cd8f3f78502132987cde8f1d1c0/examples/cantor.ftl"
            },
            { name: "Dwarfs (tex)",
              format: "tex",
              url: "https://raw.githubusercontent.com/naproche/naproche/1d645706c9e44cd8f3f78502132987cde8f1d1c0/examples/dwarfs.ftl.tex"
            },
            { name: "Groups (tex)",
              format: "tex",
              url: "https://raw.githubusercontent.com/naproche/naproche/1d645706c9e44cd8f3f78502132987cde8f1d1c0/examples/group.lean.ftl.tex"
            },
            { name: "Maximum Modulus (ftl)",
              format: "ftl",
              url: "https://raw.githubusercontent.com/naproche/naproche/1d645706c9e44cd8f3f78502132987cde8f1d1c0/examples/maximum_modulus.ftl"
            },
            { name: "Newman (ftl)",
              format: "ftl",
              url: "https://raw.githubusercontent.com/naproche/naproche/1d645706c9e44cd8f3f78502132987cde8f1d1c0/examples/newman.ftl"
            },
            { name: "Prime no square (ftl)",
              format: "ftl",
              url: "https://raw.githubusercontent.com/naproche/naproche/1d645706c9e44cd8f3f78502132987cde8f1d1c0/examples/prime_no_square.ftl"
            },
            { name: "Tarski (ftl)",
              format: "ftl",
              url: "https://raw.githubusercontent.com/naproche/naproche/1d645706c9e44cd8f3f78502132987cde8f1d1c0/examples/tarski.ftl"
            },
            // Oddly, code-mirror only shows the last 1343 lines :(
            // { name: "Tarskian Geometry (tex)",
              // url: "https://raw.githubusercontent.com/naproche/naproche/1d645706c9e44cd8f3f78502132987cde8f1d1c0/examples/geometry/formalization.ftl.tex"
            // },
        ]
    }
  }
};
</script>
