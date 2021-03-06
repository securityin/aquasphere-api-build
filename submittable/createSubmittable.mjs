// Copyright 2017-2020 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { createClass } from "./createClass.mjs";
export function createSubmittable(apiType, api, decorateMethod) {
  const Submittable = createClass({
    api,
    apiType,
    decorateMethod
  });
  return extrinsic => new Submittable(api.registry, extrinsic);
}