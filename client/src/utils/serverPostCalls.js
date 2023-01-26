export const postCallFightingRewards = async (requestUrl, address, token_id) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: address,
      token_id: token_id,
    }),
  };
  console.log(requestOptions.body, 'body');
  let returnedData = await fetch(requestUrl, requestOptions).then((response) => response.json());
  return await returnedData;
};

export const postCallExploringRewards = async (requestUrl, address, token_id, token_qty) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: address,
      token_id: token_id,
      token_qty: token_qty,
    }),
  };
  console.log(requestOptions.body, 'body');
  let returnedData = await fetch(requestUrl, requestOptions).then((response) => response.json());
  return await returnedData;
};
