(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.atn = factory());
}(this, (function () { 'use strict';

    var Web3 = require('web3');
    var Atn = /** @class */ (function () {
        function Atn(web3) {
            if (web3 === void 0) { web3 = 'ws://localhost:7576'; }
            this.decimals = 18;
            this.web3 = new Web3();
            if (typeof web3 === 'string') {
                this.web3.setProvider(new this.web3.providers.HttpProvider(web3));
            }
            else if (web3.currentProvider) {
                this.web3.setProvider(web3.currentProvider);
            }
            else {
                throw new Error('Invalid web3 provider');
            }
            this.dmc = new this.web3.eth.Contract([
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "idToAddress",
                    "outputs": [
                        {
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_dbotAddress",
                            "type": "address"
                        }
                    ],
                    "name": "register",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "dbots",
                    "outputs": [
                        {
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "name": "dbotAddress",
                            "type": "address"
                        }
                    ],
                    "name": "Register",
                    "type": "event"
                }
            ], '0x0000000000000000000000000000000000000011');
            this.cmc = new this.web3.eth.Contract([], '0x0000000000000000000000000000000000000011');
        }
        Atn.prototype.addAccount = function (account) {
            this.web3.eth.accounts.wallet.add(account);
        };
        Atn.prototype.register = function (dbotAddress, from) {
            return this.dmc.methods.register(dbotAddress).send({ from: from });
        };
        Atn.prototype.idToAddress = function (dbotId) {
            return this.dmc.methods.idToAddress(dbotId).call();
        };
        return Atn;
    }());

    return Atn;

})));
//# sourceMappingURL=atn.umd.js.map
