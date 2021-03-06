// Copyright 2017-2020 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0
// Simple non-runnable checks to test type definitions in the editor itself
import { ApiPromise } from '@polkadot/api';
import { createTestPairs } from '@polkadot/keyring/testingPairs';
import { createTypeUnsafe, TypeRegistry } from '@polkadot/types/create';
const registry = new TypeRegistry();

function consts(api) {
  // constants has actual value & metadata
  console.log(api.consts.foo.bar, api.consts.balances.existentialDeposit.toNumber(), api.consts.balances.existentialDeposit.meta.documentation.map(s => s.toString()).join(''));
}

async function derive(api) {
  await api.derive.chain.subscribeNewHeads(header => {
    console.log('current author:', header.author);
  });
  const fees = await api.derive.balances.fees();
  console.log('fees', fees);
}

async function query(api, pairs) {
  const intentions = await api.query.staking.bonded();
  console.log('intentions:', intentions); // api.query.*.* is well-typed

  const bar = await api.query.foo.bar(); // bar is Codec (unknown module)

  const bal = await api.query.balances.totalIssuance(); // bal is Balance

  const bal2 = await api.query.balances.totalIssuance('WRONG_ARG'); // bal2 is Codec (wrong args)

  const override = await api.query.balances.totalIssuance(); // override is still available

  const oldBal = await api.query.balances.totalIssuance.at('abcd'); // It's hard to correctly type .multi. Expected: `Balance[]`, actual: Codec[].
  // In the meantime, we can case with `<Balance>` (this is not available on recent chains)

  const multi = await api.query.balances.freeBalance.multi([pairs.alice.address, pairs.bob.address]);
  console.log('query types:', bar, bal, bal2, override, oldBal, multi); // check multi for unsub

  const multiUnsub = await api.queryMulti([[api.query.staking.validators], [api.query.system.events]], values => {
    console.log('values', values);
    multiUnsub();
  }); // check multi , Promise result

  const multiRes = await api.queryMulti([[api.query.system.account, pairs.eve.address], // older chains only
  [api.query.system.accountNonce, pairs.eve.address]]);
  console.log(multiRes);
}

async function queryExtra(api, pairs) {
  // events destructing
  await api.query.system.events(records => {
    records.forEach(({
      event,
      phase
    }) => {
      if (phase.isApplyExtrinsic) {
        // Dunno... this should work
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const [accountId, value] = event.data;
        console.log(`${accountId.toString()} has ${value.toHuman()}`);
      }
    });
  }); // at queries

  const events = await api.query.system.events.at('0x12345');
  console.log(`Received ${events.length} events:`); // check entries()

  await api.query.system.account.entries(); // should not take a param

  await api.query.staking.nominatorSlashInEra.entries(123); // should take a param
  // check range

  await api.query.balances.freeBalance.range(['0x1234'], pairs.bob.address); // check range types

  const entries = await api.query.system.events.range(['0x12345', '0x7890']);
  console.log(`Received ${entries.length} entries, ${entries.map(([hash, events]) => `${hash.toHex()}: ${events.length} events`).join(', ')}`);
}

async function rpc(api) {
  // defaults
  await api.rpc.chain.subscribeNewHeads(header => {
    console.log('current header #', header.number.toNumber());
  }); // with generic params

  await api.rpc.state.subscribeStorage(['my_balance_key'], ([balance]) => {
    console.log('current balance:', balance.toString());
  }); // using json & raw

  await api.rpc.chain.getBlock.json('0x123456');
  await api.rpc.chain.getBlock.raw('0x123456'); // using raw subs
  // eslint-disable-next-line @typescript-eslint/no-floating-promises

  api.rpc.chain.subscribeNewHeads.raw(result => {
    console.log(result);
  });
}

function types(api) {
  // check correct types with `createType`
  const balance = registry.createType('Balance', 2);
  const gas = registry.createType('Gas', 2);
  const compact = registry.createType('Compact<u32>', 2); // const random = registry.createType('RandomType', 2); // This one should deliberately show a TS error

  const gasUnsafe = createTypeUnsafe(registry, 'Gas', [2]);
  const overriddenUnsafe = createTypeUnsafe(registry, 'Gas', [2]);
  console.log(balance, gas, compact, gasUnsafe, overriddenUnsafe, api.createType('AccountData'));
}

async function tx(api, pairs) {
  // transfer, also allows for BigInt inputs here
  const transfer = api.tx.balances.transfer(pairs.bob.address, 123456789n);
  console.log('transfer casted', transfer, transfer); // simple "return the hash" variant

  console.log('hash:', (await transfer.signAndSend(pairs.alice)).toHex()); // passing options, but waiting for hash

  const nonce = await api.query.system.accountNonce(pairs.alice.address);
  (await api.tx.balances.transfer(pairs.bob.address, 12345).signAndSend(pairs.alice, {
    nonce
  })).toHex(); // just with the callback

  await api.tx.balances.transfer(pairs.bob.address, 12345).signAndSend(pairs.alice, ({
    status
  }) => console.log(status.type)); // with options and the callback

  const nonce2 = await api.query.system.accountNonce(pairs.alice.address);
  const unsub2 = await api.tx.balances.transfer(pairs.bob.address, 12345).signAndSend(pairs.alice, {
    nonce: nonce2
  }, ({
    status
  }) => {
    console.log('transfer status:', status.type);
    unsub2();
  }); // it allows for query & then using the submittable

  const second = api.tx.democracy.second(123, 5); // eslint-disable-next-line @typescript-eslint/no-floating-promises

  await second.signAndSend('123', result => console.log(result)); // it handles enum inputs correctly

  await api.tx.democracy.proxyVote(123, {
    Split: {
      nay: 456,
      yay: 123
    }
  }).signAndSend(pairs.alice);
}

async function main() {
  const api = await ApiPromise.create();
  const pairs = createTestPairs(); // eslint-disable-next-line @typescript-eslint/no-floating-promises

  Promise.all([consts(api), derive(api), query(api, pairs), queryExtra(api, pairs), rpc(api), types(api), tx(api, pairs)]);
} // eslint-disable-next-line @typescript-eslint/unbound-method


main().catch(console.error);