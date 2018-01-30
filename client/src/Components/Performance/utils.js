export function navigatorAggregator(historicalData) {
  // This function helps render the navigator for the chart, which is a aggregation
  //  of all currencys values in USD

  const timestep = 14400000;
  const totalValueTimeSeries = [];
  let minTimeValue = Number.MAX_VALUE;
  let maxTimeValue = 0;
  const valueMap = new Map();


  Object.keys(historicalData).forEach((key) => {
    // Transforming data of type
    //  {'currency':[[Time,~,~,AmtOwnedUSD], ...], ...} (this.props.data)
    //  to data of type
    //  MAP{'Time' : [currencyA_AmtOwnedUSD, currencyB_AmtOwnedUSD, ...]}
    for (let i = 0; i < historicalData[key].length; i += 1) {
      if (valueMap.has(historicalData[key][i][0])) {
        valueMap.get(historicalData[key][i][0]).push(historicalData[key][i][3]);
      } else {
        valueMap.set(historicalData[key][i][0], [historicalData[key][i][3]]);
      }
    }

    // Finding the minimimum start date and maximum end date for historical data
    if (historicalData[key][0][0] < minTimeValue) {
      minTimeValue = historicalData[key][0][0];
      maxTimeValue = historicalData[key][(historicalData[key].length) - 1][0];
    }
  });


  // Transforming ValueMap of data type
  //  MAP{'Time' : [currencyA_AmtOwnedUSD, currencyB_AmtOwnedUSD, ...]}
  //  to data type of
  //  [[time, totalUSDAmt], [time, totalUSDAmt], ...]
  while (minTimeValue <= maxTimeValue) {
    let value = 0.0;
    for (let i = 0; i < valueMap.get(minTimeValue).length; i += 1) {
      value += valueMap.get(minTimeValue)[i];
    }
    totalValueTimeSeries.push([minTimeValue, value]);

    minTimeValue += timestep;
  }
  return totalValueTimeSeries;
}
