const XRay = require('aws-xray-sdk-core');
const chai = require('chai');

const { expect } = chai;

const defaultRuleCfg = {
  fixed_target: 1,
  rate: 0.1,
};

const customRuleCfg = {
  http_method: '*',
  url_path: '*',
  fixed_target: 0,
  rate: 1,
};

const localRulesV1 = {
  version: 1,
  default: defaultRuleCfg,
  rules: [{
    service_name: '*',
    ...customRuleCfg,
  }],
};

const localRulesV2 = {
  version: 2,
  default: defaultRuleCfg,
  rules: [{
    host: '*',
    ...customRuleCfg,
  }],
};

describe('local sampler', () => {
  before(() => {
    XRay.middleware.disableCentralizedSampling();
  });

  it ('should parse v1 rules and v2 rules correctly', () => {
    XRay.middleware.setSamplingRules(localRulesV1);
    const customRuleV1 = XRay.middleware.sampler.rules.filter((r) => !r.default)[0];

    XRay.middleware.setSamplingRules(localRulesV2);
    const customRuleV2 = XRay.middleware.sampler.rules.filter((r) => !r.default)[0];

    expect(customRuleV1).to.deep.include(customRuleV2);
  });
});
