export default function mockRewards({ month }) {
  const r = month ? 1 : 6;
  return [...Array(r).keys()].map((i) => {
    const mockMonth = new Date();
    mockMonth.setMonth(new Date().getMonth() - i);
    return {
      date: `${mockMonth.getFullYear()}${mockMonth.getMonth() < 9 ? '0' : ''}${mockMonth.getMonth() + 1}`,
      card: Math.round(Math.random() * 100),
      social: Math.round(Math.random() * 100),
      point: Math.round(Math.random() * 10),
      currency: 'TWD',
    };
  });
}
