import { cvToHex, uintCV } from '@stacks/transactions';

export const intToHexString = (number) => {
  return cvToHex(uintCV(number));
};
