const ORDER_ASC_BY_NAME = 'AZ';
const ORDER_DESC_BY_NAME = 'ZA';
const ORDER_BY_PROD_COUNT = 'Cant.';
const ORDER_BY_SOLD_COUNT = 'Sold.';

const ORDER_BY_PRICE_DESC = 'Price Desc.';
const ORDER_BY_PRICE_ASC = 'Price Asc.';

const ORDER_BY_SOLD_COUNT_DESC = 'Sold count Desc.';
const ORDER_BY_SOLD_COUNT_ASC = 'Sold count Asc.';

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
    result = array.sort((a, b) => {
      const aCount = parseInt(a.soldCount, 10);
      const bCount = parseInt(b.soldCount, 10);

      if (aCount > bCount) { return -1; }
      if (aCount < bCount) { return 1; }
      return 0;
    });
  } else if (criteria === ORDER_BY_PRICE_DESC) {
    result = array.sort((a, b) => {
      if (a.cost > b.cost) { return -1; }
      if (a.cost < b.cost) { return 1; }
      return 0;
    });
  } else if (criteria === ORDER_BY_PRICE_ASC) {
    result = array.sort((a, b) => {
      if (a.cost > b.cost) { return 1; }
      if (a.cost < b.cost) { return -1; }
      return 0;
    });
  } else if (criteria === ORDER_BY_SOLD_COUNT_DESC) {
    result = array.sort((a, b) => {
      if (a.soldCount > b.soldCount) { return -1; }
      if (a.soldCount < b.soldCount) { return 1; }
      return 0;
    });
  } else if (criteria === ORDER_BY_SOLD_COUNT_ASC) {
    result = array.sort((a, b) => {
      if (a.soldCount > b.soldCount) { return 1; }
      if (a.soldCount < b.soldCount) { return -1; }
      return 0;
    });result = array;
  } else {
    result = array;
  }

  return result;
}


