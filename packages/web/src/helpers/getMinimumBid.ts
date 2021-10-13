const getMinimumBid = bid => {
  return (bid + bid * 0.1).toFixed(2); // updated minimum bid
};

export default getMinimumBid;
