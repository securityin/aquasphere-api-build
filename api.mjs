import { abi } from "./abi.mjs";
import { ApiPromise } from "./promise/index.mjs";
import { ContractPromise, Abi } from '@polkadot/api-contract';
import Keyring from '@polkadot/keyring';
import { WsProvider } from '@polkadot/rpc-provider';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import { numberToBn } from "./util/index.mjs";
import { find } from 'rxjs/operators';
import https from 'https';
import { toNumber } from "./util/numberToBn.mjs";

function get(path) {
  const options = {
    "method": "GET",
    "hostname": "explorer.aquasphere.io",
    "port": null,
    "path": `/api/v1${path}`,
    "headers": {
      "cache-control": "no-cache"
    }
  };
  return new Promise((resolve, reject) => {
    https.get(options, res => {
      console.info(path, res.statusCode);

      if (res.statusCode === 200) {
        var chunks = [];
        res.on("data", function (chunk) {
          chunks.push(chunk);
        });
        res.on("end", function () {
          var body = Buffer.concat(chunks);
          resolve(JSON.parse(body.toString()));
        });
      } else {
        reject(`${res.statusCode}`);
      }
    }).on('error', error => {
      reject(error);
    });
  });
}
/**
 * getContractInfo
 */


function getContractInfo(contractAdd) {
  let symbol = 'AQUA';
  let decimals = 15;
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
  });
}

class Api {
  constructor(api) {
    this.ws_url = '';
    this.mKeyring = void 0;
    this.mApi = void 0;
    this.mContractApiMap = {};
    this.mKeyring = new Keyring({
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
        let getContract = getContractInfo(contractAdd);

        if (this.ws_url === 'wss://rpc-test.aquasphere.io') {
          getContract = getContract.catch(() => ({
            abi,
            decimals: 6,
            symbol: 'ENT'
          }));
        } else {
          getContract = getContract.catch(reject);
        }

        getContract.then(info => {
          if (info) {
            const abi = new Abi(info.abi, this.mApi.registry.getChainProperties());
            const contract = new ContractPromise(this.mApi, abi, contractAdd);
            this.mContractApiMap[contractAdd] = {
              contract,
              decimals: info.decimals,
              symbol: info.symbol,
              abi
            };
            resolve(this.mContractApiMap[contractAdd]);
          }
        });
      }
    });
  }

  static create(ws_url) {
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
      const mApi = new Api(api);
      mApi.ws_url = ws_url;
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
   * contractTransfer
   * @public cont
   */


  contractTransfer(contract, from, to, amount, call) {
    this.initContract(contract).then(contractApi => {
      contractApi.contract.tx.transfer(0, -1, to, numberToBn(amount, contractApi.decimals)).signAndSend(from, result => {
        const {
          events,
          status
        } = result;

        if (status.isFinalized) {
          let mStatus = 'success';
          const block_hash = status.asFinalized.toString();
          const de = this.decodeEvents(events, contractApi);

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
                if (index === 2) value = toNumber(item, contractApi.decimals);
              });
            }

            call({
              key: `${block_hash}:${de.event_index}`,
              status: mStatus,
              msg,
              from,
              to,
              value
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
    }).catch(e => call({
      msg: e,
      status: 'error'
    }));
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


  queryContractTransation(contract, key, call) {
    this.initContract(contract).then(contractApi => {
      const bi = key.split(':');
      this.mApi.query.system.events.at(bi[0]).then(events => {
        const event = (events || []).find(e => e && e.event && e.event.index && e.event.index.toString() === bi[1]);

        if (event) {
          const {
            data,
            method,
            section
          } = event.event;

          if (section === 'contracts' && method === 'ContractExecution') {
            const deEvent = contractApi.abi.decodeEvent(data[1]);
            const args = deEvent.args.map(item => item.toString());
            const isFailed = deEvent.event.identifier.includes('Failed');
            const status = isFailed ? 'error' : 'success';
            let from,
                to,
                value,
                msg = undefined;

            if (isFailed) {
              msg = args;
            } else {
              args.forEach((item, index) => {
                if (index === 0) from = item;
                if (index === 1) to = item;
                if (index === 2) value = toNumber(item, contractApi.decimals);
              });
            }

            call({
              msg,
              status,
              from,
              to,
              value
            });
          } else if (section === 'system' && method === 'ExtrinsicFailed') {
            call({
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
    }).catch(e => call({
      msg: e,
      status: 'error'
    }));
  }

}

export { Api };