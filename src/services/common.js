import moment from "moment";

const CommonService = {

  /**
   * From the list of events given by the API call, returns an object with two lists. 
   * rawData, a list of all the event dates, formatted YYYY-MM-DD
   * formattedData, a list of objects with properties x --> date and y --> event count
   * @param {Array} data - List of events from the API
   */
  formatData(data) {
    const rawData = [];
    const formattedData = [];
    data.forEach(element => {
      rawData.push(moment.unix(element.timestamp).format("YYYY-MM-DD"));
    });
    rawData.forEach(e => {
      const index = formattedData.findIndex(f => {
        if (f.x) {
          return f.x === e;
        } else {
          return false;
        }
      });
      if (index != -1) {
        formattedData[index].y += 1;
      } else {
        formattedData.push({ x: e, y: 1 });
      }
    });
    return { rawData, formattedData };
  },

  /**
   * Returns the data object for the chart with the datapoints and their labels and some options such as color and line width...
   * @param {Array} formattedData - Array of objects {x: date, y: count}
   * @param {Array} labels - Array of unique dates
   */
  createDataCollection(formattedData, labels) {
    return {
      labels,
      datasets: [
        {
          label: 'Number of daily events',
          data: formattedData,
          backgroundColor: 'rgba(63,47,202,.5)',
          borderColor: '#6f42c1',
          borderWidth: 3
        }
      ]
    }
  },

  /**
   * Returns the option object for the chart depending on the length of the data collection.
   * The time scale switches from days to weeks if there is more than 15 days displayed,
   * and changes from weeks to months if more than 60 days are displayed.
   * @param {number} length - Length of the data points
   */
  createOptions(length) {
    let time = {};
    if (length > 60) {
      time = {
        unit: "month",
        displayFormats: {
          month: 'MMM YYYY'
        }
      }
    } else if (length > 15) {
      time = {
        unit: "week",
        displayFormats: {
          week: 'll'
        }
      }
    } else {
      time = {
        unit: "day",
        displayFormats: {
          day: 'MM/DD/YYYY'
        }
      }
    }
    return {
      scales: {
        xAxes: [{
          type: 'time',
          time,
          distribution: 'linear'
        }],
        yAxes: [{
          ticks: { beginAtZero: true }
        }]
      },
      responsive: true,
      maintainAspectRatio: false
    }
  }
}

export default CommonService
