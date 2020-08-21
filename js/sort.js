const ORDER_ASC_BY_NAME = 'AZ';
const ORDER_DESC_BY_NAME = 'ZA';
const ORDER_BY_PROD_COUNT = 'Cant.';
const ORDER_BY_SOLD_COUNT = 'Sold.';
const FILTER = 'Filter';

function sortArray(criteria, array) {
  let result = [];
  if (criteria === ORDER_ASC_BY_NAME) {
    result = array.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });
  } else if (criteria === ORDER_DESC_BY_NAME) {
    result = array.sort((a, b) => {
      if (a.name > b.name) { return -1; }
      if (a.name < b.name) { return 1; }
      return 0;
    });
  } else if (criteria === ORDER_BY_PROD_COUNT) {
    result = array.sort((a, b) => {
      const aCount = parseInt(a.productCount, 10);
      const bCount = parseInt(b.productCount, 10);

      if (aCount > bCount) { return -1; }
      if (aCount < bCount) { return 1; }
      return 0;
    });
  } else if (criteria === ORDER_BY_SOLD_COUNT) {
      console.log('aca')
    result = array.sort((a, b) => {
        const aCount = parseInt(a.soldCount, 10);
        const bCount = parseInt(b.soldCount, 10);
  
        if (aCount > bCount) { return -1; }
        if (aCount < bCount) { return 1; }
        return 0;
      });



  } else {
      result = array;
  }

  return result;
}


