import CommonService from '@/services/common';

describe('CommonService', () => {
  describe('createOptions method creates the option object for the chart depending on the length of the dataCollection', () => {
    it('returns the options object with the right properties', () => {
      const options = CommonService.createOptions(14);
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
    });
    it('returns the options object with a time unit of days when length is below 15', () => {
      expect(CommonService.createOptions(14).scales.xAxes[0].time).toHaveProperty('unit', 'day');
      expect(CommonService.createOptions(14).scales.xAxes[0].time.displayFormats).toEqual({
        day: 'MM/DD/YYYY'
      });
    });
    it('returns the options object with a time unit of month when length is above 60', () => {
      expect(CommonService.createOptions(61).scales.xAxes[0].time).toHaveProperty('unit', 'month');
      expect(CommonService.createOptions(61).scales.xAxes[0].time.displayFormats).toEqual({
        month: 'MMM YYYY'
      });
    });
    it('returns the options object with a time unit of week when length is between 15 and 60', () => {
      expect(CommonService.createOptions(60).scales.xAxes[0].time).toHaveProperty('unit', 'week');
      expect(CommonService.createOptions(60).scales.xAxes[0].time.displayFormats).toEqual({
        week: 'll'
      });
    });
  });

  describe('createDataCollection method creates the data object for the chart with the datapoints and their labels', () => {
    it('returns an object with the proper structure', () => {
      const formattedData = [
        {
          x: "2020-11-03",
          y: 8
        },
        {
          x: "2020-11-04",
          y: 8
        },
        {
          x: "2020-11-05",
          y: 12
        },
        {
          x: "2020-11-06",
          y: 10
        },
        {
          x: "2020-11-07",
          y: 4
        },
        {
          x: "2020-11-09",
          y: 2
        },
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
    });
  });

  describe('formatData method returns an object with two arrays. One with the array of parsed dates and one with object with dates and count', () => {

    const data = [{ timestamp: 1604427000, tag_id: "00demo000017", alert: "[ADAM]", details: "25224E04*527*263" }, { timestamp: 1604427000, tag_id: "00demo000013", alert: "[ADAM]", details: "25224E04*485*220" }, { timestamp: 1604434680, tag_id: "00demo000017", alert: "[ADAM]", details: "25224E04*251*263" }, { timestamp: 1604434680, tag_id: "00demo000011", alert: "[ADAM]", details: "25224E04*210*225" }, { timestamp: 1604437560, tag_id: "00demo000018", alert: "[ADAM]", details: "25224E04*300*327" }, { timestamp: 1604437560, tag_id: "00demo000010", alert: "[ADAM]", details: "25224E04*255*285" }, { timestamp: 1604450340, tag_id: "00demo000016", alert: "[ADAM]", details: "25224E04*265*229" }, { timestamp: 1604450340, tag_id: "00demo000011", alert: "[ADAM]", details: "25224E04*215*190" }];

    const formattedData = CommonService.formatData(data);
    it('returns an array of dates with the format YYYY-MM-DD named RawData', () => {
      expect(formattedData).toHaveProperty('rawData');
      expect(Array.isArray(formattedData.rawData)).toBeTruthy();
      expect(formattedData.rawData[0]).toMatch(/\d{4}-\d{2}-\d{2}/);
    });
    it('returns an array of objects with properties x and y named formattedData', () => {
      expect(formattedData).toHaveProperty('formattedData');
      expect(Array.isArray(formattedData.formattedData)).toBeTruthy();
      expect(formattedData.formattedData[0]).toHaveProperty('x');
      expect(formattedData.formattedData[0]).toHaveProperty('y');
    });
    it('should have a YYYY-MM-DD date for x', () => {
      expect(formattedData.formattedData[0].x).toMatch(/\d{4}-\d{2}-\d{2}/);
    });
    it('should have a number for property y', () => {
      expect(typeof formattedData.formattedData[0].y === "number").toBeTruthy();
    });
  });

});
