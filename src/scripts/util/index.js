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

export const getOfficeFromData = (office) => {
  let officeName;
  if (office.level === 'federal') {
    switch (office.chamber) {
      case 'upper': 
        officeName = `${office.state} Senator`;
        break;
      
      case 'lower': 
        officeName = `${office.state}-${office.district} Rep`;
        break;
      
      case 'nationwide': 
        officeName = 'President'
        break;
    }
  } else if (office.level === 'state') {
        switch (office.chamber) {
          case 'upper':
            officeName = `${office.state} state senator`;
            break;

          case 'lower':
            officeName = `${office.state} state rep`;
            break;

          case 'statewide':
            officeName = `${office.state} Governor`;
            break;
        }
  }
  return officeName;
}