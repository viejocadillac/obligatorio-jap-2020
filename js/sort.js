const ASC = 'Ascendente';
const DESC = 'Descendente';

let lastSorted;

function sortArray(criteria, array, options) {
  const result = array.sort((a, b) => {
    let n1 = a[options.key];
    let n2 = b[options.key];

    if (options.areNumbers) {
      n1 = parseInt(n1, 10);
      n2 = parseInt(n2, 10);
    }

    if (criteria === ASC) {
      if (n1 > n2) { return 1; }
      if (n1 < n2) { return -1; }
    } else if (criteria === DESC) {
      if (n1 > n2) { return -1; }
      if (n1 < n2) { return 1; }
    }
    return 0;
  });
  return result;
}

const filterByRange = ((array, keyToCompare, min, max) => {
  const filtrados = array.filter(( element) => element[keyToCompare] > min && element[keyToCompare] < max);
  return filtrados;
});

const addOrderListener = (buttonId, array, order, sortOptions, cb) => {
  document.getElementById(buttonId).addEventListener('click', () => {
    const newOrder = sortArray(order, array, sortOptions);
    lastSorted = newOrder;
    cb(newOrder);
  });
};


