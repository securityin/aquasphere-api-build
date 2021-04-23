import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import { Abi, ContractPromise } from '@polkadot/api-contract';
import Keyring from '@polkadot/keyring';
import { WsProvider } from '@polkadot/rpc-provider';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import { find } from 'rxjs/operators';
import { abi } from "./abi.mjs";
import { ApiPromise } from "./promise/index.mjs";
import { numberToBn } from "./util/index.mjs";
import { toNumber } from "./util/numberToBn.mjs";

// interface ContractInfo {
//   symbol: string,
//   decimals: number,
//   abi: AnyJson,
// }
class ContractExtrisic {
  constructor(ex, cm) {
    this.extrinsic = void 0;
    this.contract_message = void 0;
    this.contract_message = cm;
    this.extrinsic = ex;
  }

}

class Api {
  // private symbol = 'ENT'
  // private mContractApiMap: { [key: string]: ContractApi } = {}
  constructor(api, ws_url) {
    this.ws_url = void 0;
    this.mKeyring = void 0;
    this.mApi = void 0;
    this.mAbi = void 0;
    this.mContract = void 0;
    this.decimals = 6;
    this.contractAdd = '5HQbAzQQu4DxvBeJrEQiGjiEwdEGWoeFsgqLJdWQgYYGUNrB';
    this.tokenDecimals = 15;
    this.tokenSymbol = "AQUA";
    this.mKeyring = new Keyring({
      type: 'sr25519'
    });
    this.ws_url = ws_url;
    this.mApi = api;
    this.mAbi = new Abi(abi, api.registry.getChainProperties());
    this.mContract = new ContractPromise(api, abi, this.contractAdd);
  } // private initContract(contractAdd: string): Promise<ContractApi> {
  //   return new Promise<ContractApi>((resolve, reject) => {
  //     if (this.mContractApiMap[contractAdd]) {
  //       resolve(this.mContractApiMap[contractAdd])
  //     } else {
  //       let getContract: Promise<ContractInfo | void> = getContractInfo(contractAdd)
  //       if (this.ws_url === 'wss://rpc-test.aquasphere.io') {
  //         getContract = getContract.catch(() => ({ abi, decimals: 6, symbol: 'ENT' }))
  //       } else {
  //         getContract = getContract.catch(reject)
  //       }
  //       getContract.then(info => {
  //         if (info) {
  //           const abi = new Abi(info.abi, this.mApi.registry.getChainProperties())
  //           const contract = new ContractPromise(this.mApi, abi, contractAdd)
  //           this.mContractApiMap[contractAdd] = { contract, decimals: info.decimals, symbol: info.symbol, abi }
  //           resolve(this.mContractApiMap[contractAdd])
  //         }
  //       })
  //     }
  //   })
  // }


  static create(ws_url = 'wss://rpc.aquasphere.io') {
    const provider = new WsProvider(ws_url);
    const types = {
      Address: 'AccountId',
      EthereumTxHash: 'H256',
      LookupSource: 'AccountId',
      PeerId: 'Vec<u8>'
    };
    return ApiPromise.create({
      provider,
      types
    }).then(api => {
      return api.rpc.system.properties().then(properties => ({
        properties,
        api
      }));
    }).then(({
      api,
      properties
    }) => {
      const mApi = new Api(api, ws_url);
      mApi.tokenDecimals = Number(properties.tokenDecimals.toString());
      mApi.tokenSymbol = properties.tokenSymbol.toString();
      return mApi;
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
    const words = mnemonicGenerate();
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
   * TransferEnt
   * @public cont
   */


  transferEnt(from, to, amount, extra, call) {
    if (amount <= 0) {
      call({
        msg: ['amount error'],
        status: 'error'
      });
      return;
    }

    this.mContract.tx.transfer(0, -1, to, numberToBn(amount, this.decimals), extra).signAndSend(from, result => {
      const {
        events,
        status
      } = result;

      if (status.isFinalized) {
        let mStatus = 'success';
        const block_hash = status.asFinalized.toString();
        const de = this.decodeEvents(events);

        if (de) {
          let msg,
              from,
              to,
              value = undefined;
          const r = result;

          if (de.msg.includes('ExtrinsicFailed') || r.contractEvents && find(r.contractEvents, item => item.event.identifier.includes('Failed'))) {
            mStatus = 'error';
            msg = de.msg;
          } else {
            de.msg.forEach((item, index) => {
              if (index === 0) from = item;
              if (index === 1) to = item;
              if (index === 2) value = toNumber(item, this.decimals);
            });
          }

          call({
            key: `${block_hash}:${de.event_index}`,
            status: mStatus,
            msg,
            from,
            to,
            value,
            extra
          });
        }
      } else if (!status.isReady && !status.isBroadcast && !status.isInBlock) {
        console.info('other status::', status.toString());
        call({
          msg: [''],
          status: 'error'
        });
      }
    });
  }

  transfer(from, to, amount, call) {
    if (amount <= 0) {
      call({
        msg: ['amount error'],
        status: 'error'
      });
      return;
    }

    this.mApi.tx.balances.transfer(to, numberToBn(amount, this.tokenDecimals)).signAndSend(from, ({
      events,
      status
    }) => {
      if (status.isFinalized) {
        const block_hash = status.asFinalized.toString();
        let fromAdd = from.address;
        let msg = undefined;

        for (const e of events) {
          console.log('e:::', `${e.event.section}-${e.event.method}-${e.event.index.toString()}`);
        }

        const e = events.find(e => e.event.section === 'system' && e.event.method.startsWith('Extrinsic'));

        if (e) {
          let mStatus = e.event.method === 'ExtrinsicSuccess' ? 'success' : 'error';
          let index = e.event.index.toString();
          call({
            key: `${block_hash}:${index}`,
            status: mStatus,
            msg,
            from: fromAdd,
            to,
            value: amount
          });
        } else {
          call({
            msg: ['no event'],
            status: 'error'
          });
        }
      } else if (!status.isReady && !status.isBroadcast && !status.isInBlock) {
        console.info('other status::', status.toString());
        call({
          msg: [status.toString()],
          status: 'error'
        });
      }
    });
  }

  decodeEvents(events) {
    for (const e of events) {
      const {
        data,
        method,
        section,
        index
      } = e.event;
      console.log('events--', data.toString(), section, method, index.toString());

      if (section === 'contracts' && method === 'ContractExecution') {
        const decodeEvent = this.mAbi.decodeEvent(data[1]);
        const args = decodeEvent.args.map(item => item.toString());
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
   * getContractExtrinsics
   * @param block_hash 
   * @param contractApi 
   * @returns 
   */


  getContractExtrinsics(block_hash) {
    return this.mApi.rpc.chain.getBlock(block_hash).then(block => {
      const exList = [];
      block.block.extrinsics.forEach(ex => {
        if (ex.method.section === 'contracts' && ex.method.method === 'call') {
          var _ex$method$args$find;

          const encode = (_ex$method$args$find = ex.method.args.find(a => a.toString().startsWith('0x'))) === null || _ex$method$args$find === void 0 ? void 0 : _ex$method$args$find.toU8a();

          if (encode) {
            ex.callIndex;
            const msg = this.mAbi.decodeMessage(encode);
            console.info('ex:::', ex.signer.toString(), msg.args.toString());
            exList.push(new ContractExtrisic(ex, msg)); // console.info('ex:::', msg.message)
          }
        }
      });
      return exList;
    });
  }

  getContractEvent(block_hash, event_index) {
    return this.mApi.query.system.events.at(block_hash).then(events => {
      const event = events.find(e => e.event.index.toString() === event_index);
      if (!event) throw 'no event';

      const nEvent = _objectSpread({}, event);

      if (event.event.section === 'contracts' && event.event.method === 'ContractExecution') {
        nEvent.contract_event = this.mAbi.decodeEvent(event.event.data[1]);
      }

      return nEvent;
    });
  }
  /**
   * queryContractTransation
   */


  queryEntTransation(key, call) {
    const bi = key.split(':');
    const getExtrinsics = this.getContractExtrinsics(bi[0]);
    const getEvent = this.getContractEvent(bi[0], bi[1]);
    Promise.all([getExtrinsics, getEvent]).then(data => {
      const [extrinsics, event] = data;
      let from,
          to,
          value,
          extra = undefined;
      console.info("index:::", event.event.index.toHuman());

      if (event.contract_event) {
        const cIndex = event.contract_event.event.index;
        console.info('contract_event_index::', cIndex);
        const ex = extrinsics.pop();

        if (ex) {
          var _ex$contract_message$;

          from = ex.extrinsic.signer.toString();
          to = ex.contract_message.args[0].toString();
          value = toNumber(ex.contract_message.args[1].toString(), this.decimals);
          extra = (_ex$contract_message$ = ex.contract_message.args[2]) === null || _ex$contract_message$ === void 0 ? void 0 : _ex$contract_message$.toString();
        }

        const isFailed = event.contract_event.event.identifier.includes('Failed');
        call({
          status: isFailed ? 'error' : 'success',
          from,
          to,
          value,
          extra
        });
      } else if (event.event.section === 'system' && event.event.method === 'ExtrinsicFailed') {
        call({
          msg: ['ExtrinsicFailed'],
          status: 'error',
          from,
          to,
          value
        });
      } else {
        call(null);
      }
    });
  } // get balance of ENT


  getEntBalance(address, call) {
    this.mContract.query.balanceOf(address, {
      value: 0,
      gasLimit: -1
    }, address).then(res => {
      const value = res.output.toString();
      call(toNumber(value, this.decimals));
    }).catch(e => call(null, e));
  } // get balance of AQUA


  getBalance(address, call) {
    this.mApi.query.system.account(address).then(res => {
      call(toNumber(res.data.free.toString(), this.tokenDecimals));
    }).catch(e => call(null, e));
  }

}

export { Api };