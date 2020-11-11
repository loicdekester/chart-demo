import moment from "moment";

const CommonService = {

  /**
   * From the list of events given by the API call, returns an object with two objects. 
   * dataCollection, parameters for the plotting of the chart
   * options, options for the design of the chart
   * @param {Array} data - List of events from the API
   */
  formatData(data) {
    const rawData = [];
    const formattedData = [];
    let max = 0;
    data.forEach(element => {
      rawData.push(moment.unix(element.timestamp).format("YYYY-MM-DD"));
    });
    formattedData.push({ x: rawData[0], y: 1 });
    max = 1;
    let j = 0;
    for (let i = 1; i < rawData.length;) {
      while (rawData[i] && rawData[i] === formattedData[j].x) {
        formattedData[j].y += 1;
        if (max < formattedData[j].y) {
          max = formattedData[j].y;
        }
        i++;
      }
      if (rawData[i]) {
        formattedData.push({ x: rawData[i], y: 1 });
        j++;
        i++;
      }
    }
    const labels = [...new Set(rawData)];
    const dataCollection = this.createDataCollection(formattedData, labels);
    const options = this.createOptions(labels.length, max);
    return { dataCollection, options };
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
          borderWidth: 3,
          lineTension: 0
        }
      ]
    }
  },

  /**
  * Returns the option object for the chart depending on the length of the data collection and the maximum value for count.
  * The time scale switches from days to weeks if there is more than 15 days displayed,
  * and changes from weeks to months if more than 60 days are displayed.
  * The Y axis always start at 0 and the maximum value is the attribute max + 1 tick;
  * @param {number} length - Length of the data points
  * @param {number} max - maximum Y value
  */
  createOptions(length, max) {
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
          ticks: {
            beginAtZero: true,
            suggestedMax: max + 1
          }
        }]
      },
      responsive: true,
      maintainAspectRatio: false
    }
  }
};

export default CommonService
