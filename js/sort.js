/* eslint-disable no-unused-vars */
// Son utilizadas en otros archivos

const ASC = 'Ascendente';
const DESC = 'Descendente';

let lastSorted;

function sortArray(criteria, array, options) {
  const result = array.sort((a, b) => {
    let n1 = a[options.key];
    let n2 = b[options.key];

    /*
      Si en las opciones esta marcado que lo que contienen
      las variables accedidas mediante 'key' son numeros (en forma de string )
      se los convierte a number
    */
    if (options.areNumbers) {
      n1 = parseInt(n1, 10);
      n2 = parseInt(n2, 10);
    }

    if (criteria === ASC) {
      if (n1 > n2) return 1;
      if (n1 < n2) return -1;
    } else if (criteria === DESC) {
      if (n1 > n2) return -1;
      if (n1 < n2) return 1;
    }
    return 0;
  });
  return result;
}

const filterByRange = ((array, keyToCompare, min, max, cb) => {
  const filtered = array.filter((element) => {
    const n = element[keyToCompare];
    return n > min && n < max;
  });
  cb(filtered);
});

const addOrderListener = (buttonId, array, order, sortOptions, cb) => {
  document.getElementById(buttonId).addEventListener('click', () => {
    const newOrder = sortArray(order, array, sortOptions);
    // Se utiliza en otros archivos
    lastSorted = newOrder;
    cb(newOrder);
  });
};

const addClearFilterListener = (btnId, minValueInputId, maxValueInputId, cb) => {
  document.getElementById(btnId).addEventListener('click', () => {
    document.getElementById(minValueInputId).value = '';
    document.getElementById(maxValueInputId).value = '';
    cb(lastSorted);
  });
};

const getNumberValues = (...ids) => {
  const values = ids.map((id) => parseInt(document.getElementById(id).value, 10));
  return values;
};
