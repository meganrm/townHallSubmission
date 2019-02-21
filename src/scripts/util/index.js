export const zeroPadDistrict = (district) => {
  const zeroPadding = '00';
  return zeroPadding.slice(0, zeroPadding.length - district.length) + district;
};

export const sanitizeDistrict = (district) => {
  if (district && Number(district)) {
    district = zeroPadDistrict(district);
  } else if (district === 'At-large') {
    district = '00';
  } else if (!district) {
    district = '';
  }
  return district;
};
