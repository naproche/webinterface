<template>
  <div class="main-menu pure-menu pure-menu-horizontal">
    <div class="pure-menu-heading">Naproche</div>
    <ul class="pure-menu-list">
      <li class="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
        <div href="#" id="menuLink1" class="pure-menu-link">Load</div>
        <ul class="pure-menu-children">
          <li class="pure-menu-item" v-for="file in files" :key="file.name">
            <a v-on:click="onLoadFile(file.url); false;"
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
            <a v-on:click="activeFormat = format.name; onFormatChange(format.name); false;"
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
    onFormatChange: Function,
    onProverChange: Function,
    showFormatToggle: Boolean,
    onLoadFile: Function,
  },
  data () {
    return {
        activeProver: "spass",
        provers: [
            { name: "spass",
              description: "SPASS (runs in browser)"
            },
            // { name: "eprover",
              // description: "Eprover (System On TPTP)"
            // }
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
            { name: "Cantor (ftl)",
              url: "https://raw.githubusercontent.com/naproche/naproche/1d645706c9e44cd8f3f78502132987cde8f1d1c0/examples/cantor.ftl"
            },
            { name: "Checkerboard (ftl)",
              url: "https://raw.githubusercontent.com/naproche/naproche/1d645706c9e44cd8f3f78502132987cde8f1d1c0/examples/checkerboard.ftl"
            },
            // Oddly, code-mirror only shows the last 1343 lines :(
            // { name: "Tarskian Geometry (tex)",
              // url: "https://raw.githubusercontent.com/naproche/naproche/1d645706c9e44cd8f3f78502132987cde8f1d1c0/examples/geometry/formalization.ftl.tex"
            // },
            { name: "Prime no square (ftl)",
              url: "https://raw.githubusercontent.com/naproche/naproche/1d645706c9e44cd8f3f78502132987cde8f1d1c0/examples/prime_no_square.ftl"
            }
        ]
    }
  }
};
</script>
