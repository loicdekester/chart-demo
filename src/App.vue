<template>
  <div id="app">
    <TheHeader />
    <AlertVue v-if="error && error.message" :message="error.message"/>
    <div class="container homepage">
      <h2>Welcome to this chart demo</h2>
      <div>
        <p>The data comes from the FastSensor API using the demo credentials</p>
      </div>
      <div>
        <p>The default range of this chart is one week, from seven days ago to now</p>
      </div>
      <div>
        <p>You can change the dates and submit to display the data from different ranges</p>
      </div>
      <form @submit.prevent="onSubmit()">
        <div class="row justify-content-center">
          <div class="col-md-4">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">Start Date</span>
              </div>
              <input id="startDate" type="date" class="form-control" v-model="startDate">
            </div>
          </div>
          <div class="col-md-4">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">End Date</span>
              </div>
              <input id="endDate" type="date" class="form-control" v-model="endDate">
            </div>
          </div>
          <button type="submit" class="btn btn-dark"> Submit </button>
        </div>
      </form>
      <div class="container chart">
        <ChartVue v-if="loaded" :chartData="dataCollection" :options="options" />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import TheHeader from "@/components/TheHeader";
import ChartVue from "@/components/Chart";
import AlertVue from "@/components/Alert";
import ApiService from "@/services/api";
import CommonService from "@/services/common";

export default {
  name: 'App',
  components: {
    TheHeader,
    ChartVue,
    AlertVue
  },
  data () {
    return {
      dataCollection: null,
      startDate: null,
      endDate: null,
      options: null,
      loaded: false,
      error: null
    }
  },
  async mounted () {
    await this.auth();
    this.defaultData()
  },

  methods: {
    async auth() {
      await ApiService.auth().then(async response => {
        if (response.data && response.data.access_token) {
          localStorage.setItem("access_token", response.data.access_token);
          await ApiService.get('v1/locations').then(res => {
            if (res.data && res.data.data && res.data.data[0] && res.data.data[0].id) {
              localStorage.setItem("location", res.data.data[0].id);
            } else {
              throw new Error(`Get location failed`);
            }
          }).catch(() => {throw new Error(`Get location failed`)});
        } else {
          throw new Error(`API Authorization failed`);
        }
      }).catch(err => this.displayError(err));
    },
    async defaultData () {
      this.endDate = moment().format("YYYY-MM-DD");
      this.startDate = moment().subtract(7,'d').format("YYYY-MM-DD");
      await this.getRange(this.startDate,this.endDate);
      this.loaded = true;
    },
    async onSubmit() {
      await this.getRange(moment(this.startDate).format("YYYY-MM-DD"), moment(this.endDate).format("YYYY-MM-DD"));
    },
    async getRange(startDate, endDate) {
      let data = {};
      await ApiService.query(`v1/locations/${localStorage.getItem("location")}/alerts`, {start_date:startDate, end_date:endDate, selector:"[ADAM]"}).then( response => {
        data = CommonService.formatData(response.data.data);
      }).catch(err => {
        this.displayError(err);
      });
      const labels = [...new Set(data.rawData)];
      this.dataCollection = CommonService.createDataCollection(data.formattedData, labels);
      this.options = CommonService.createOptions(labels.length);
    },
    displayError(err) {
      this.error=err;
      setInterval(()=>this.error = null,3000);
    }
  }
}
</script>

<style>
.chart {
  max-height: 800px;
  margin-top: 20px;
}
.homepage {
  margin-top: 60px;
}
</style>
