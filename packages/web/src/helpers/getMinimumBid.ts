const getMinimumBid = bid => {
  const addition = bid * 0.1;
  return (bid + (addition < 0.1 ? 0.1 : addition)).toFixed(1); // updated minimum bid
};

export default getMinimumBid;
