export function navigatorAggregator(historicalData) {
  // This function helps render the navigator for the chart, which is a aggregation
  //  of all currencys values in USD

  const timestep = 14400000; // TODO: Take difference between timestamps to determine timestep
  const totalValueTimeSeries = [];
  let minTimeValue = Number.MAX_VALUE;
  let maxTimeValue = 0;
  const valueMap = new Map();

// This section runs through each key, transforming a number of different
//  arrays of historical data into a single map storing all of the data

// Transforming data of type
//  {'currencyA':[[Time,~,~,AmtOwnedUSD], ...], ...} (this.props.data)
//  to data of type
//  MAP{'Time' : [currencyA_AmtOwnedUSD, currencyB_AmtOwnedUSD, ...]}
  Object.keys(historicalData).forEach((key) => {
    for (let i = 0; i < historicalData[key].length; i += 1) {
      // If the Map has the timestamp already stored, push the USD value at that
      //  timestamp to the array stored at that timestamps key value in the map
      //  Otherwise, create a new array with the USD value stored at the
      //  timestamps key value
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

  // This section iterates from the earliest timestamp recorded to the latest,
  //  transforming the map into a simple timeseries array recording the
  //  aggreggated account in USD

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
