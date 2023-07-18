"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var hardhat_1 = require("hardhat");
var ffjavascript_1 = require("ffjavascript");
var ethers_1 = require("ethers");
var unstringifyBigInts = ffjavascript_1.utils.unstringifyBigInts;
var fs = require("fs");
var snarkjs = require("snarkjs");
var BASE_PATH = "./circuits/polycircuit/";
function p256(n) {
    var nstr = n.toString(16);
    while (nstr.length < 64)
        nstr = "0" + nstr;
    nstr = "0x".concat(nstr);
    return ethers_1.BigNumber.from(nstr);
}
function generateCallData() {
    return __awaiter(this, void 0, Promise, function () {
        var zkProof, proof, pub, inputs, i, pi_a, pi_b, pi_c, input;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateProof()];
                case 1:
                    zkProof = _a.sent();
                    proof = unstringifyBigInts(zkProof.proof);
                    pub = unstringifyBigInts(zkProof.publicSignals);
                    inputs = "";
                    for (i = 0; i < pub.length; i++) {
                        if (inputs != "")
                            inputs = inputs + ",";
                        inputs = inputs + p256(pub[i]);
                    }
                    pi_a = [p256(proof.pi_a[0]), p256(proof.pi_a[1])];
                    pi_b = [[p256(proof.pi_b[0][1]), p256(proof.pi_b[0][0])], [p256(proof.pi_b[1][1]), p256(proof.pi_b[1][0])]];
                    pi_c = [p256(proof.pi_c[0]), p256(proof.pi_c[1])];
                    input = [inputs];
                    return [2 /*return*/, { pi_a: pi_a, pi_b: pi_b, pi_c: pi_c, input: input }];
            }
        });
    });
}
function generateProof() {
    return __awaiter(this, void 0, void 0, function () {
        var inputData, input, out, proof;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    inputData = fs.readFileSync(BASE_PATH + "input.json", "utf8");
                    input = JSON.parse(inputData);
                    return [4 /*yield*/, snarkjs.wtns.calculate(input, BASE_PATH + "out/circuit.wasm", BASE_PATH + "out/circuit.wtns")
                        // calculate proof
                    ];
                case 1:
                    out = _a.sent();
                    return [4 /*yield*/, snarkjs.groth16.prove(BASE_PATH + "out/polycircuit.zkey", BASE_PATH + "out/circuit.wtns")
                        // write proof to file
                    ];
                case 2:
                    proof = _a.sent();
                    // write proof to file
                    fs.writeFileSync(BASE_PATH + "out/proof.json", JSON.stringify(proof, null, 1));
                    return [2 /*return*/, proof];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var Verifier, verifier, _a, pi_a, pi_b, pi_c, input, tx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, hardhat_1.ethers.getContractFactory("./contracts/PolycircuitVerifier.sol:Verifier")];
                case 1:
                    Verifier = _b.sent();
                    return [4 /*yield*/, Verifier.deploy()];
                case 2:
                    verifier = _b.sent();
                    return [4 /*yield*/, verifier.deployed()];
                case 3:
                    _b.sent();
                    console.log("Verifier deployed to ".concat(verifier.address));
                    return [4 /*yield*/, generateCallData()];
                case 4:
                    _a = _b.sent(), pi_a = _a.pi_a, pi_b = _a.pi_b, pi_c = _a.pi_c, input = _a.input;
                    return [4 /*yield*/, verifier.verifyProof(pi_a, pi_b, pi_c, input)];
                case 5:
                    tx = _b.sent();
                    console.log("Verifier result: ".concat(tx));
                    console.assert(tx == true, "Proof verification failed!");
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (error) {
    console.error(error);
    process.exitCode = 1;
});
