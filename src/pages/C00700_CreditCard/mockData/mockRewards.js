export default function mockRewards(month) {
  const r = month ? 1 : 6;
  return [...Array(r).keys()].map((i) => {
    const mockMonth = new Date().setMonth(new Date().getMonth() - i);
    return {
      month: mockMonth.getMonth() + 1,
      card: 12,
      social: 32,
      point: 64,
    };
  });
}
