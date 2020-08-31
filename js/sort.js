const ASC = 'Ascendente';
const DESC = 'Descendente';

function sortArray(criteria, array, options) {
  let result;
  if (criteria === ASC) {
    result = array.sort((a, b) => {
      let n1 = a[options.key];
      let n2 = b[options.key];

      if (options.areNumbers) {
        n1 = parseInt(n1, 10);
        n2 = parseInt(n2, 10);
      }

      if (n1 > n2) { return 1; }
      if (n1 < n2) { return -1; }
      return 0;
    });
  } else if (criteria === DESC) {
    result = array.sort((a, b) => {
      let n1 = a[options.key];
      let n2 = b[options.key];

      if (options.areNumbers) {
        n1 = parseInt(n1, 10);
        n2 = parseInt(n2, 10);
      }
      if (n1 > n2) { return -1; }
      if (n1 < n2) { return 1; }
      return 0;
    });
  } else {
    result = array;
  }
  return result;
}
