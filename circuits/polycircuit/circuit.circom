pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/gates.circom";

template Polycircuit () {
    signal input a;
    signal input b;
    signal x;
    signal y;
    signal output q;

    component orGate = OR();

    x <== a * b;
    
    y <== 1 + b - 2*b;

    orGate.a <== x;
    orGate.b <== y;
    q <== orGate.out;

    log("q", q);
}

component main = Polycircuit();