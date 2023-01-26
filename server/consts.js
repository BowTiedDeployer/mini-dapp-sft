const network = 'testnet';
const subdomain = 'sft-rpg';
const maxStacksTxFee = 750000;

const coreApiUrl = {
  mainnet: `https://stacks-node-api.mainnet.stacks.co`,
  testnet: `https://ancient-dawn-shadow.stacks-testnet.discover.quiknode.pro/207b1d96de37979493f2e1a9148caa69705473fd`,
  mocknet: `http://localhost:3999`,
};

const adminAddress = {
  mainnet: '',
  testnet: 'ST2X3CR8JZRC4A7M9N8RKFMT0KYFFJFXGEZBEYQ8C',
  mocknet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
};

const contractAddress = {
  mainnet: '',
  testnet: 'ST2X3CR8JZRC4A7M9N8RKFMT0KYFFJFXGEZBEYQ8C',
  mocknet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
};

module.exports = {
  network,
  subdomain,
  maxStacksTxFee,
  coreApiUrl,
  adminAddress,
  contractAddress,
};
