import _classPrivateFieldLooseBase from "@babel/runtime/helpers/esm/classPrivateFieldLooseBase";
import _classPrivateFieldLooseKey from "@babel/runtime/helpers/esm/classPrivateFieldLooseKey";
// Copyright 2017-2020 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Metadata } from '@polkadot/metadata';
import { TypeRegistry } from '@polkadot/types/create';
import { LATEST_EXTRINSIC_VERSION } from '@polkadot/types/extrinsic/Extrinsic';
import { getSpecAlias, getSpecTypes, getUpgradeVersion } from '@polkadot/types-known';
import { BN_ZERO, assert, logger, u8aEq, u8aToU8a } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { Decorate } from "./Decorate.mjs";
const KEEPALIVE_INTERVAL = 15000;
const DEFAULT_BLOCKNUMBER = {
  unwrap: () => BN_ZERO
};
const l = logger('api/init');

var _healthTimer = _classPrivateFieldLooseKey("healthTimer");

var _registries = _classPrivateFieldLooseKey("registries");

var _updateSub = _classPrivateFieldLooseKey("updateSub");

var _onProviderConnect = _classPrivateFieldLooseKey("onProviderConnect");

var _onProviderDisconnect = _classPrivateFieldLooseKey("onProviderDisconnect");

var _onProviderError = _classPrivateFieldLooseKey("onProviderError");

export class Init extends Decorate {
  constructor(options, type, decorateMethod) {
    super(options, type, decorateMethod);
    Object.defineProperty(this, _healthTimer, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _registries, {
      writable: true,
      value: []
    });
    Object.defineProperty(this, _updateSub, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _onProviderConnect, {
      writable: true,
      value: async () => {
        this.emit('connected');

        this._isConnected.next(true);

        try {
          const [hasMeta, cryptoReady] = await Promise.all([this._loadMeta(), this._options.initWasm === false ? Promise.resolve(true) : cryptoWaitReady()]);

          if (hasMeta && !this._isReady && cryptoReady) {
            this._isReady = true;
            this.emit('ready', this);
          }

          _classPrivateFieldLooseBase(this, _healthTimer)[_healthTimer] = setInterval(() => {
            this._rpcCore.system.health().toPromise().catch(() => {// ignore
            });
          }, KEEPALIVE_INTERVAL);
        } catch (_error) {
          const error = new Error(`FATAL: Unable to initialize the API: ${_error.message}`);
          l.error(error);
          l.error(_error);
          this.emit('error', error);
        }
      }
    });
    Object.defineProperty(this, _onProviderDisconnect, {
      writable: true,
      value: () => {
        this.emit('disconnected');

        this._isConnected.next(false);

        if (_classPrivateFieldLooseBase(this, _healthTimer)[_healthTimer]) {
          clearInterval(_classPrivateFieldLooseBase(this, _healthTimer)[_healthTimer]);
          _classPrivateFieldLooseBase(this, _healthTimer)[_healthTimer] = null;
        }
      }
    });
    Object.defineProperty(this, _onProviderError, {
      writable: true,
      value: error => {
        this.emit('error', error);
      }
    });

    if (!this.hasSubscriptions) {
      l.warn('Api will be available in a limited mode since the provider does not support subscriptions');
    } // all injected types added to the registry for overrides


    this.registry.setKnownTypes(options); // We only register the types (global) if this is not a cloned instance.
    // Do right up-front, so we get in the user types before we are actually
    // doing anything on-chain, this ensures we have the overrides in-place

    if (!options.source) {
      this.registerTypes(options.types);
    } else {
      _classPrivateFieldLooseBase(this, _registries)[_registries] = _classPrivateFieldLooseBase(options.source, _registries)[_registries];
    }

    this._rpc = this._decorateRpc(this._rpcCore, this._decorateMethod);
    this._rx.rpc = this._decorateRpc(this._rpcCore, this._rxDecorateMethod);
    this._queryMulti = this._decorateMulti(this._decorateMethod);
    this._rx.queryMulti = this._decorateMulti(this._rxDecorateMethod);
    this._rx.signer = options.signer;

    this._rpcCore.setRegistrySwap(hash => this.getBlockRegistry(hash));

    this._rpcCore.provider.on('disconnected', _classPrivateFieldLooseBase(this, _onProviderDisconnect)[_onProviderDisconnect]);

    this._rpcCore.provider.on('error', _classPrivateFieldLooseBase(this, _onProviderError)[_onProviderError]);

    this._rpcCore.provider.on('connected', _classPrivateFieldLooseBase(this, _onProviderConnect)[_onProviderConnect]); // If the provider was instantiated earlier, and has already emitted a
    // 'connected' event, then the `on('connected')` won't fire anymore. To
    // cater for this case, we call manually `this._onProviderConnect`.


    if (this._rpcCore.provider.isConnected) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      _classPrivateFieldLooseBase(this, _onProviderConnect)[_onProviderConnect]();
    }
  }
  /**
   * @description Decorates a registry based on the runtime version
   */


  _initRegistry(registry, chain, version, chainProps) {
    registry.setChainProperties(chainProps || this.registry.getChainProperties());
    registry.setKnownTypes(this._options);
    registry.register(getSpecTypes(registry, chain, version.specName, version.specVersion)); // for bundled types, pull through the aliasses defined

    if (registry.knownTypes.typesBundle) {
      registry.knownTypes.typesAlias = getSpecAlias(registry, chain, version.specName);
    }

    return registry;
  }
  /**
   * @description Sets up a registry based on the block hash defined
   */


  async getBlockRegistry(blockHash) {
    // shortcut in the case where we have an immediate-same request
    const lastBlockHash = u8aToU8a(blockHash);

    const existingViaHash = _classPrivateFieldLooseBase(this, _registries)[_registries].find(r => r.lastBlockHash && u8aEq(lastBlockHash, r.lastBlockHash));

    if (existingViaHash) {
      return existingViaHash;
    } // ensure we have everything required


    assert(this._genesisHash && this._runtimeVersion, 'Cannot retrieve data on an uninitialized chain'); // We have to assume that on the RPC layer the calls used here does not call back into
    // the registry swap, so getHeader & getRuntimeVersion should not be historic

    const header = this._genesisHash.eq(blockHash) ? {
      number: DEFAULT_BLOCKNUMBER,
      parentHash: this._genesisHash
    } : await this._rpcCore.chain.getHeader(blockHash).toPromise();
    assert((header === null || header === void 0 ? void 0 : header.parentHash) && !header.parentHash.isEmpty, 'Unable to retrieve header and parent from supplied hash'); // get the runtime version, either on-chain or via an known upgrade history

    const [firstVersion, lastVersion] = getUpgradeVersion(this._genesisHash, header.number.unwrap());
    const version = firstVersion && (lastVersion || firstVersion.specVersion.eq(this._runtimeVersion.specVersion)) ? {
      specName: this._runtimeVersion.specName,
      specVersion: firstVersion.specVersion
    } : await this._rpcCore.state.getRuntimeVersion(header.parentHash).toPromise(); // check for pre-existing registries

    const existingViaVersion = _classPrivateFieldLooseBase(this, _registries)[_registries].find(r => r.specVersion.eq(version.specVersion));

    if (existingViaVersion) {
      existingViaVersion.lastBlockHash = lastBlockHash;
      return existingViaVersion;
    } // nothing has been found, construct new


    const registry = this._initRegistry(new TypeRegistry(), this._runtimeChain, version);

    const metadata = await this._rpcCore.state.getMetadata(header.parentHash).toPromise();
    const result = {
      isDefault: false,
      lastBlockHash,
      metadata,
      metadataConsts: null,
      registry,
      specVersion: version.specVersion
    };
    registry.setMetadata(metadata);

    _classPrivateFieldLooseBase(this, _registries)[_registries].push(result);

    return result;
  }

  async _loadMeta() {
    var _this$_options$source;

    const genesisHash = await this._rpcCore.chain.getBlockHash(0).toPromise(); // on re-connection to the same chain, we don't want to re-do everything from chain again

    if (this._isReady && !this._options.source && genesisHash.eq(this._genesisHash)) {
      return true;
    }

    if (this._genesisHash) {
      l.warn('Connection to new genesis detected, re-initializing');
    }

    this._genesisHash = genesisHash;

    if (_classPrivateFieldLooseBase(this, _updateSub)[_updateSub]) {
      _classPrivateFieldLooseBase(this, _updateSub)[_updateSub].unsubscribe();
    }

    const {
      metadata = {}
    } = this._options; // only load from on-chain if we are not a clone (default path), alternatively
    // just use the values from the source instance provided

    this._runtimeMetadata = (_this$_options$source = this._options.source) !== null && _this$_options$source !== void 0 && _this$_options$source._isReady ? await this._metaFromSource(this._options.source) : await this._metaFromChain(metadata);
    return this._initFromMeta(this._runtimeMetadata);
  } // eslint-disable-next-line @typescript-eslint/require-await


  async _metaFromSource(source) {
    this._extrinsicType = source.extrinsicVersion;
    this._runtimeChain = source.runtimeChain;
    this._runtimeVersion = source.runtimeVersion;
    this._genesisHash = source.genesisHash;
    const methods = []; // manually build a list of all available methods in this RPC, we are
    // going to filter on it to align the cloned RPC without making a call

    Object.keys(source.rpc).forEach(section => {
      Object.keys(source.rpc[section]).forEach(method => {
        methods.push(`${section}_${method}`);
      });
    });

    this._filterRpcMethods(methods);

    return source.runtimeMetadata;
  } // subscribe to metadata updates, inject the types on changes


  _subscribeUpdates() {
    if (_classPrivateFieldLooseBase(this, _updateSub)[_updateSub] || !this.hasSubscriptions) {
      return;
    }

    _classPrivateFieldLooseBase(this, _updateSub)[_updateSub] = this._rpcCore.state.subscribeRuntimeVersion().pipe(switchMap(version => {
      var _this$_runtimeVersion;

      return (// only retrieve the metadata when the on-chain version has been changed
        (_this$_runtimeVersion = this._runtimeVersion) !== null && _this$_runtimeVersion !== void 0 && _this$_runtimeVersion.specVersion.eq(version.specVersion) ? of(false) : this._rpcCore.state.getMetadata().pipe(map(metadata => {
          l.log(`Runtime version updated to spec=${version.specVersion.toString()}, tx=${version.transactionVersion.toString()}`);
          this._runtimeMetadata = metadata;
          this._runtimeVersion = version;
          this._rx.runtimeVersion = version; // update the default registry version

          const thisRegistry = _classPrivateFieldLooseBase(this, _registries)[_registries].find(({
            isDefault
          }) => isDefault);

          assert(thisRegistry, 'Initialization error, cannot find the default registry'); // setup the data as per the current versions

          thisRegistry.metadata = metadata;
          thisRegistry.metadataConsts = null;
          thisRegistry.registry.setMetadata(metadata);
          thisRegistry.specVersion = version.specVersion; // clear the registry types to ensure that we override correctly

          this._initRegistry(thisRegistry.registry.init(), this._runtimeChain, version);

          this.injectMetadata(metadata, false, thisRegistry.registry);
          return true;
        }))
      );
    })).subscribe();
  }

  async _metaFromChain(optMetadata) {
    var _this$_genesisHash;

    const [runtimeVersion, chain, chainProps] = await Promise.all([this._rpcCore.state.getRuntimeVersion().toPromise(), this._rpcCore.system.chain().toPromise(), this._rpcCore.system.properties().toPromise()]); // set our chain version & genesisHash as returned

    this._runtimeChain = chain;
    this._runtimeVersion = runtimeVersion;
    this._rx.runtimeVersion = runtimeVersion; // initializes the registry

    this._initRegistry(this.registry, chain, runtimeVersion, chainProps);

    this._subscribeUpdates(); // filter the RPC methods (this does an rpc-methods call)


    await this._filterRpc(); // retrieve metadata, either from chain  or as pass-in via options

    const metadataKey = `${((_this$_genesisHash = this._genesisHash) === null || _this$_genesisHash === void 0 ? void 0 : _this$_genesisHash.toHex()) || '0x'}-${runtimeVersion.specVersion.toString()}`;
    const metadata = metadataKey in optMetadata ? new Metadata(this.registry, optMetadata[metadataKey]) : await this._rpcCore.state.getMetadata().toPromise();
    this.registry.setMetadata(metadata); // setup the initial registry, when we have none

    if (!_classPrivateFieldLooseBase(this, _registries)[_registries].length) {
      _classPrivateFieldLooseBase(this, _registries)[_registries].push({
        isDefault: true,
        lastBlockHash: null,
        metadata,
        metadataConsts: null,
        registry: this.registry,
        specVersion: runtimeVersion.specVersion
      });
    } // get unique types & validate


    metadata.getUniqTypes(false);
    return metadata;
  }

  async _initFromMeta(metadata) {
    const metaExtrinsic = metadata.asLatest.extrinsic; // only inject if we are not a clone (global init)

    if (metaExtrinsic.version.gt(BN_ZERO)) {
      this._extrinsicType = metaExtrinsic.version.toNumber();
    } else if (!this._options.source) {
      // detect the extrinsic version in-use based on the last block
      const {
        block: {
          extrinsics: [firstTx]
        }
      } = await this._rpcCore.chain.getBlock().toPromise(); // If we haven't sync-ed to 1 yes, this won't have any values

      this._extrinsicType = firstTx ? firstTx.type : LATEST_EXTRINSIC_VERSION;
    }

    this._rx.extrinsicType = this._extrinsicType;
    this._rx.genesisHash = this._genesisHash;
    this._rx.runtimeVersion = this._runtimeVersion;
    this.injectMetadata(metadata, true); // derive is last, since it uses the decorated rx

    this._rx.derive = this._decorateDeriveRx(this._rxDecorateMethod);
    this._derive = this._decorateDerive(this._decorateMethod);
    return true;
  }

}