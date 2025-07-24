// Generate years array from 2025 to current year
export const generateYearsArray = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2025;
  const years = [];

  for (let year = startYear; year <= currentYear; year++) {
    years.push({
      label: year.toString(),
      value: year,
    });
  }

  return years;
};
