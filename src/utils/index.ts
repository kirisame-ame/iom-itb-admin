export const formattedPrice = (value: number) => {
  if (value === undefined || value === null) return '';
  const numberValue = value;

  if (isNaN(numberValue)) return '';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(numberValue);
};

export const formatDate = (dateString: string, timeZone: string = 'Asia/Jakarta') => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone,
  });

  const weekday = formatter.format(date);
  const day = date.toLocaleString('en-US', { day: '2-digit', timeZone });
  const monthIndex = date.toLocaleString('en-US', { month: 'numeric', timeZone });
  const month = monthNames[parseInt(monthIndex) - 1];
  const year = date.toLocaleString('en-US', { year: 'numeric', timeZone });
  const time = date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone });

  return `${weekday}, ${day} ${month} ${year}, ${time}`;
};

export const truncate = (name: string, length = 50) => {
  return name?.length > length ? `${name.substring(0, length)}...` : name;
};
