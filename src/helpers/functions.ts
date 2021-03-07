export const groupBy = (array : Array<unknown>, key :string) : object => {
  // @ts-ignore
  return array.reduce((result, currentValue) => {
    // @ts-ignore

    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    return result;
  }, {});
 };

/*
export const groupBy = (array:Array<object>,keys:Array<string>) =>
  array.reduce((objectsByKeyValue, obj) => {
    // @ts-ignore
    const value = keys.map(key => obj[key]).join('-');
    // @ts-ignore
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});
  */
