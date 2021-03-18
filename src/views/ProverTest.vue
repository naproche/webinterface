<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>{{ file }}</p>
  </div>
</template>

<script>
export default {
  name: "About",
  data() {
    return {
      file: "",
      prover: undefined
    }
  },
  mounted() {
    const task = catAxioms + `
      cnf(ab_equals_c,hypothesis,
          ( product(a,b,c) )).

      cnf(cancellation_for_product,hypothesis,
          ( ~ product(c,X1,X2)
          | ~ product(c,X3,X2)
          | X1 = X3 )).

      cnf(bh_equals_d,hypothesis,
          ( product(b,h,d) )).

      cnf(bg_equals_d,hypothesis,
          ( product(b,g,d) )).

      cnf(prove_h_equals_g,negated_conjecture,
          (  h != g )).
    `;
    var addFile = t => { this.file = this.file + t; };
    this.prover = new Worker('prover.js');
    this.prover.onmessage = function(msg) {
      addFile(msg.data.content);
    }
    this.prover.postMessage(task);
  },
  beforeUnmount() {
      this.prover.terminate();
  }
};

const catAxioms = `
%----Notice that composition is read as compose(x,y)(G) means x o y, -i.e.
%----x(y(G)). It is a skolem function from -(all x all
%----y, (DEF(x,y) -> exists z (P(x,y,z)))).

%-----Composition is closed when defined
cnf(closure_of_composition,axiom,
    ( ~ defined(X,Y)
    | product(X,Y,compose(X,Y)) )).

%-----Associative property
cnf(associative_property1,axiom,
    ( ~ product(X,Y,Z)
    | defined(X,Y) )).

cnf(associative_property2,axiom,
    ( ~ product(X,Y,Xy)
    | ~ defined(Xy,Z)
    | defined(Y,Z) )).

%-----Special category theory axiom
cnf(category_theory_axiom1,axiom,
    ( ~ product(X,Y,Xy)
    | ~ product(Y,Z,Yz)
    | ~ defined(Xy,Z)
    | defined(X,Yz) )).

cnf(category_theory_axiom2,axiom,
    ( ~ product(X,Y,Xy)
    | ~ product(Xy,Z,Xyz)
    | ~ product(Y,Z,Yz)
    | product(X,Yz,Xyz) )).

cnf(category_theory_axiom3,axiom,
    ( ~ product(Y,Z,Yz)
    | ~ defined(X,Yz)
    | defined(X,Y) )).

cnf(category_theory_axiom4,axiom,
    ( ~ product(Y,Z,Yz)
    | ~ product(X,Y,Xy)
    | ~ defined(X,Yz)
    | defined(Xy,Z) )).

cnf(category_theory_axiom5,axiom,
    ( ~ product(Y,Z,Yz)
    | ~ product(X,Yz,Xyz)
    | ~ product(X,Y,Xy)
    | product(Xy,Z,Xyz) )).

cnf(category_theory_axiom6,axiom,
    ( ~ defined(X,Y)
    | ~ defined(Y,Z)
    | ~ identity_map(Y)
    | defined(X,Z) )).

%-----Properties of domain(x) and codomain(x)
cnf(domain_is_an_identity_map,axiom,
    ( identity_map(domain(X)) )).

cnf(codomain_is_an_identity_map,axiom,
    ( identity_map(codomain(X)) )).

cnf(mapping_from_x_to_its_domain,axiom,
    ( defined(X,domain(X)) )).

cnf(mapping_from_codomain_of_x_to_x,axiom,
    ( defined(codomain(X),X) )).

cnf(product_on_domain,axiom,
    ( product(X,domain(X),X) )).

cnf(product_on_codomain,axiom,
    ( product(codomain(X),X,X) )).

%-----Definition of the identity predicate
cnf(identity1,axiom,
    ( ~ defined(X,Y)
    | ~ identity_map(X)
    | product(X,Y,Y) )).

cnf(identity2,axiom,
    ( ~ defined(X,Y)
    | ~ identity_map(Y)
    | product(X,Y,X) )).

%-----Composition is well defined
cnf(composition_is_well_defined,axiom,
    ( ~ product(X,Y,Z)
    | ~ product(X,Y,W)
    | Z = W )).
`;
</script>