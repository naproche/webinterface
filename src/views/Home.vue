<template>
  <div class="home">
    <div>
      <h1>Naproche</h1>
      <p>
        Naproche (short for 'Natural proof checking') is a proof assistant that
        accepts restricted natural language as input. It can translate this
        input to first order logic and export it to an automatic theorem prover.
        The latest stable version can be found on
        <a href="https://github.com/naproche/naproche/">Github</a> and is also
        part of the
        <a href="https://isabelle.in.tum.de/">Isabelle 2021</a> distribution.
      </p>
      <p>
        The development version of Naproche also supports a web interface which
        you can access with the links below. Since it runs completely in the
        browser it is usually a bit slower than on the Desktop and the bundled
        ATP is currently somewhat weak.
      </p>
      <ul>
        <li>
          <router-link to="/text">Write Naproche on the Web</router-link>
        </li>
        <li>
          <router-link to="/github">Load from Github</router-link>
        </li>
        <li>
          <router-link
            to="/github/naproche/naproche/dev/lib%2fexamples%2fgeometry%2fformalization.ftl.tex"
            >See the Geometry example</router-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding-top: 5em;
  display: flex;
  align-items: center;
  justify-content: center;
}

h1 {
  font-size: 2em;
  text-align: center;
  padding-bottom: 0.5em;
}

.home p {
  width: 30em;
  text-align: justify;
  padding-bottom: 0.5em;
}
</style>

<script>
export default {
  name: "Home"
};
</script>
