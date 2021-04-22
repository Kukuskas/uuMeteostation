module.exports = (arr1, arr2, idKey) => {
  let mergedObject = {};
  arr1.forEach(entry => {
    const key = entry[idKey];
    mergedObject[key] = entry;
  });
  arr2.forEach(entry => {
    const key = entry[idKey];
    mergedObject[key] = entry;
  });
  return Object.values(mergedObject);
}