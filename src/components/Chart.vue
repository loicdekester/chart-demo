<script>
import { Line, mixins } from 'vue-chartjs';

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  name: "ChartVue",
  props: ['options'],
  watch: {
    deep: true,
    'options': {
      handler() {
        this.renderChart(this.chartData, this.options)
      }
    }
  },
  mounted(){
    this.renderChart(this.chartData, this.options)
  }
}
</script>
