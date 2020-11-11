import moment from "moment";

const CommonService = {
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
