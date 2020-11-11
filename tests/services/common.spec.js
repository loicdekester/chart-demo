import CommonService from '@/services/common';

describe('CommonService', () => {
  describe('createOptions method creates the option object for the chart depending on the length of the dataCollection and the max count', () => {
    it('returns the options object with the right properties', () => {
      const options = CommonService.createOptions(14, 6);
      expect(options).toHaveProperty('scales');
      expect(options).toHaveProperty('responsive');
      expect(options).toHaveProperty('maintainAspectRatio');
      expect(options.scales).toHaveProperty('xAxes');
      expect(options.scales).toHaveProperty('yAxes');
      expect(options.scales.xAxes[0]).toHaveProperty('type');
      expect(options.scales.xAxes[0]).toHaveProperty('time');
      expect(options.scales.xAxes[0]).toHaveProperty('distribution');
      expect(options.scales.xAxes[0].time).toHaveProperty('unit');
      expect(options.scales.xAxes[0].time).toHaveProperty('displayFormats');
      expect(options.scales.yAxes[0]).toHaveProperty('ticks');
      expect(options.scales.yAxes[0].ticks).toHaveProperty('beginAtZero');
      expect(options.scales.yAxes[0].ticks).toHaveProperty('suggestedMax');
    });
    it('returns the options object with a time unit of days when length is below 15', () => {
      expect(CommonService.createOptions(14, 6).scales.xAxes[0].time).toHaveProperty('unit', 'day');
      expect(CommonService.createOptions(14, 6).scales.xAxes[0].time.displayFormats).toEqual({
        day: 'MM/DD/YYYY'
      });
    });
    it('returns the options object with a time unit of month when length is above 60', () => {
      expect(CommonService.createOptions(61, 6).scales.xAxes[0].time).toHaveProperty('unit', 'month');
      expect(CommonService.createOptions(61, 6).scales.xAxes[0].time.displayFormats).toEqual({
        month: 'MMM YYYY'
      });
    });
    it('returns the options object with a time unit of week when length is between 15 and 60', () => {
      expect(CommonService.createOptions(60, 6).scales.xAxes[0].time).toHaveProperty('unit', 'week');
      expect(CommonService.createOptions(60, 6).scales.xAxes[0].time.displayFormats).toEqual({
        week: 'll'
      });
    });
    it('returns the options object with a suggestedMax of max + 1 ', () => {
      expect(CommonService.createOptions(60, 6).scales.yAxes[0].ticks.suggestedMax).toBe(7);
    });
  });

  describe('createDataCollection method creates the data object for the chart with the datapoints and their labels', () => {
    it('returns an object with the proper structure', () => {
      const formattedData = [
        { x: "2020-11-03", y: 8 }, { x: "2020-11-04", y: 8 }, { x: "2020-11-05", y: 12 }, { x: "2020-11-06", y: 10 }, { x: "2020-11-07", y: 4 }, { x: "2020-11-09", y: 2 },
      ];
      const labels = ["2020-11-03", "2020-11-04", "2020-11-05", "2020-11-06", "2020-11-07", "2020-11-09"];
      const data = CommonService.createDataCollection(formattedData, labels);
      expect(data).toHaveProperty('labels');
      expect(data).toHaveProperty('datasets');
      expect(data.datasets[0]).toHaveProperty('label');
      expect(data.datasets[0]).toHaveProperty('data');
      expect(data.datasets[0]).toHaveProperty('backgroundColor');
      expect(data.datasets[0]).toHaveProperty('borderColor');
      expect(data.datasets[0]).toHaveProperty('borderWidth');
      expect(data.datasets[0]).toHaveProperty('lineTension');
    });
  });

  describe('formatData method returns an object with two objects. One with the data and the other the options for the chart', () => {

    const data = [{ timestamp: 1604427000, tag_id: "00demo000017", alert: "[ADAM]", details: "25224E04*527*263" }, { timestamp: 1604427000, tag_id: "00demo000013", alert: "[ADAM]", details: "25224E04*485*220" }, { timestamp: 1604434680, tag_id: "00demo000017", alert: "[ADAM]", details: "25224E04*251*263" }, { timestamp: 1604434680, tag_id: "00demo000011", alert: "[ADAM]", details: "25224E04*210*225" }, { timestamp: 1604437560, tag_id: "00demo000018", alert: "[ADAM]", details: "25224E04*300*327" }, { timestamp: 1604437560, tag_id: "00demo000010", alert: "[ADAM]", details: "25224E04*255*285" }, { timestamp: 1604450340, tag_id: "00demo000016", alert: "[ADAM]", details: "25224E04*265*229" }, { timestamp: 1604450340, tag_id: "00demo000011", alert: "[ADAM]", details: "25224E04*215*190" }];

    const formattedData = CommonService.formatData(data);
    it('should return an object with properties options and dataCollection', () => {
      expect(formattedData).toHaveProperty('dataCollection');
      expect(formattedData).toHaveProperty('options');
    });
    it('dataCollection.labels is an array of dates formatted YYYY-MM-DD', () => {
      expect(Array.isArray(formattedData.dataCollection.labels)).toBeTruthy();
      expect(formattedData.dataCollection.labels[0]).toMatch(/\d{4}-\d{2}-\d{2}/);
    });
    it('returns an array of objects with properties x and y named formattedData', () => {
      expect(Array.isArray(formattedData.dataCollection.datasets[0].data)).toBeTruthy();
      expect(formattedData.dataCollection.datasets[0].data[0]).toHaveProperty('x');
      expect(formattedData.dataCollection.datasets[0].data[0]).toHaveProperty('y');
    });
    it('should have a YYYY-MM-DD date for x', () => {
      expect(formattedData.dataCollection.datasets[0].data[0].x).toMatch(/\d{4}-\d{2}-\d{2}/);
    });
    it('should have a number for property y', () => {
      expect(typeof formattedData.dataCollection.datasets[0].data[0].y === "number").toBeTruthy();
    });
  });

});
