export const getDate = () => {
  const today = new Date();

  const twoDaysAgo = new Date(today);

  twoDaysAgo.setDate(today.getDate() - 2);

  return {
    today: today.toISOString().split("T")[0],
    twoDaysAgo: twoDaysAgo.toISOString().split("T")[0],
  };
};
