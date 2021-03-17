"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Api = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _abi = require("./abi");

var _promise = require("./promise");

var _apiContract = require("@polkadot/api-contract/");

var _keyring = _interopRequireDefault(require("@polkadot/keyring"));

var _rpcProvider = require("@polkadot/rpc-provider");

var _utilCrypto = require("@polkadot/util-crypto");

var _util = require("./util");

var _operators = require("rxjs/operators");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function get(path) {
  const base = 'https://explorer.aquasphere.io/api/v1'; // const base =  'https://explorer.aquasphere.io/api/v1'

  return fetch(`${base}${path}`, {
    method: 'get'
  }).then(res => res.json()).then(JSON.parse);
}
/**
 * getContractInfo
 */


function getContractInfo(contractAdd) {
  let symbol = 'ENT';
  let decimals = 6;
  return get(`/contract/instance/${contractAdd}`).then(data => {
    symbol = data.data.attributes.symbol;
    decimals = data.data.attributes.decimals;
    const code_hash = data.data.attributes.code_hash;
    return get(`/contract/contract/${code_hash}`);
  }).then(data => {
    return {
      symbol,
      decimals,
      abi: data.data.attributes.abi
    };
  }).catch(e => {
    return {
      symbol: 'ENT',
      decimals: 6,
      abi: _abi.abi
    };
  });
}

class Api {
  constructor(api) {
    this.mKeyring = void 0;
    this.mApi = void 0;
    this.mContractApiMap = {};
    this.mKeyring = new _keyring.default({
      ss58Format: 2,
      type: 'sr25519'
    });
    this.mApi = api;
  }

  initContract(contractAdd) {
    return new Promise((resolve, reject) => {
      if (this.mContractApiMap[contractAdd]) {
        resolve(this.mContractApiMap[contractAdd]);
      } else {
        getContractInfo(contractAdd).then(info => {
          const abi = new _apiContract.Abi(info.abi, this.mApi.registry.getChainProperties());
          const contract = new _apiContract.ContractPromise(this.mApi, abi, contractAdd);
          this.mContractApiMap[contractAdd] = {
            contract,
            decimals: info.decimals,
            symbol: info.symbol,
            abi
          };
          resolve(this.mContractApiMap[contractAdd]);
        }).catch(reject);
      }
    });
  }

  static create(ws_url) {
    const provider = new _rpcProvider.WsProvider(ws_url);
    const types = {
      Address: 'AccountId',
      EthereumTxHash: 'H256',
      LookupSource: 'AccountId',
      PeerId: 'Vec<u8>'
    };
    return _promise.ApiPromise.create({
      provider,
      types
    }).then(api => {
      return new Api(api);
    });
  }
  /**
   * close
   */


  close() {
    this.mApi.disconnect();
  }
  /**
   * createAcount
   */


  generateAcount(meta, type) {
    const words = (0, _utilCrypto.mnemonicGenerate)();
    const keyPair = this.mKeyring.createFromUri(words, meta, type);
    return {
      words,
      keyPair
    };
  }
  /**
   * @param words 
   * @returns 
   */


  addFromWords(words, meta, type) {
    return this.mKeyring.addFromUri(words, meta, type);
  }
  /**
   * addToKeyrkeyring: KeyringPairing
   */


  addToKeyring(keyring) {
    return this.mKeyring.addPair(keyring);
  }
  /**
   * 
   * contractTransfer
   * @public cont
   */


  contractTransfer(contract, from, to, amount, call) {
    this.initContract(contract).then(contractApi => {
      contractApi.contract.tx.transfer(0, -1, to, (0, _util.numberToBn)(amount, contractApi.decimals)).signAndSend(from, result => {
        const {
          events,
          status
        } = result;

        if (status.isInBlock || status.isFinalized) {
          let mStatus = status.isInBlock ? 'inBlock' : 'isFinalized';
          const block_hash = status.isInBlock ? status.asInBlock.toString() : status.asFinalized.toString();
          const de = this.decodeEvents(events, contractApi);

          if (de) {
            const r = result;

            if (de.msg.includes('ExtrinsicFailed') || r.contractEvents && (0, _operators.find)(r.contractEvents, item => item.event.identifier.includes('Failed'))) {
              mStatus = 'error';
            }

            call(_objectSpread(_objectSpread({}, de), {}, {
              status: mStatus,
              block_hash
            }));
          }
        } else if (!status.isReady && !status.isBroadcast) {
          console.info('other status::', status.toString());
          call({
            msg: [''],
            status: 'error'
          });
        }
      });
    });
  }

  decodeEvents(events, contractApi) {
    for (const e of events) {
      const {
        data,
        method,
        section,
        index
      } = e.event;
      console.log('events--', data.toString(), section, method, index.toString());

      if (section === 'contracts' && method === 'ContractExecution') {
        const args = contractApi.abi.decodeEvent(data[1]).args.map(item => item.toString());
        return {
          event_index: index.toString(),
          msg: args
        };
      } else if (section === 'system' && method === 'ExtrinsicFailed') {
        return {
          event_index: index.toString(),
          msg: ['ExtrinsicFailed']
        };
      }
    }

    return null;
  }
  /**
   * queryContractTransation
   */


  queryContractTransation(contract, block_hash, block_index, call) {
    this.initContract(contract).then(contractApi => {
      this.mApi.query.system.events.at(block_hash).then(events => {
        const event = (events || []).find(e => e && e.event && e.event.index && e.event.index.toString() === block_index);

        if (event) {
          const {
            data,
            method,
            section
          } = event.event;

          if (section === 'contracts' && method === 'ContractExecution') {
            const msg = contractApi.abi.decodeEvent(data[1]);
            const args = msg.args.map(item => item.toString());
            const status = msg.event.identifier.includes('Failed') ? 'error' : 'isFinalized';
            call({
              event_index: block_index,
              msg: args,
              status
            });
          } else if (section === 'system' && method === 'ExtrinsicFailed') {
            call({
              event_index: block_index,
              msg: ['ExtrinsicFailed'],
              status: 'error'
            });
          } else {
            call(null);
          }
        } else {
          call(null);
        }
      });
    });
  }

}

exports.Api = Api;