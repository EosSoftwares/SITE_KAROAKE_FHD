<template>
  <div>    

    <base-header type="info" class="pb-6">
      <b-row aling-v="center" class="py-4">
        <b-col cols="7" lg="6">
          <h6 class="h2 text-white d-inline-block mb-0">FHD Karaokê</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-bread-crumb></route-bread-crumb>
          </nav>
        </b-col>
      </b-row>
      <!-- Card stats -->
      <b-row>
        <b-col xl="3" md="6">
          <stats-card title="Músicas adquiridas"
              type="gradient-red"
              sub-title="97"
              icon="ni ni-headphones">
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card title="Músicas geradaa"
            type="gradient-orange"
            sub-title="2,356"
            icon="ni ni-chart-pie-35">
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card title="Total cantado"
            type="gradient-green"
            sub-title="924"
            icon="ni ni-money-coins">
          </stats-card>

        </b-col>
        <b-col xl="3" md="6">
          <stats-card title="Média"
            type="gradient-info"
            sub-title="7,80"
            icon="ni ni-chart-bar-32">
          </stats-card>
        </b-col>
      </b-row>
    </base-header>

    <!--Charts-->
    <b-container fluid class="mt--6">
      <b-row>
        <b-col xl="8">
          <card type="default" header-classes="bg-transparent">
            <b-row align-v="center" slot="header">
              <b-col>
                <h6 class="text-light text-uppercase ls-1 mb-1">Crie a sua música</h6>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12" class="d-flex align-items-center flex-column">
                <div class="w-100">
                  <tags-input placeholder="Adicionar categoria" class="test w-100 mb-4"></tags-input>
                  <base-input
                    class="w-100"
                    label="Insira o link da sua música"
                    placeholder="Insira o link da sua música"/>

                </div>
                <base-button type="success">Gerar música</base-button>
              </b-col>
            </b-row>
          </card>
        </b-col>

        <b-col xl="4">
          <card header-classes="bg-transparent">
            <b-row align-v="center" slot="header">
              <b-col>
                <h6 class="text-uppercase text-muted ls-1 mb-1">Performance</h6>
                <h5 class="h3 mb-0">Total orders</h5>
              </b-col>
            </b-row>

            <bar-chart
              :height="350"
              ref="barChart"
              :chart-data="redBarChart.chartData"
            >
            </bar-chart>
          </card>
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>
<script>
  // Charts
  import * as chartConfigs from '@/components/Charts/config';
  import LineChart from '@/components/Charts/LineChart';
  import BarChart from '@/components/Charts/BarChart';

  // Components
  import RouteBreadCrumb from '@/components/Breadcrumb/RouteBreadcrumb';
  import StatsCard from '@/components/Cards/StatsCard';


  import TagsInput from '@/components/Inputs/TagsInput'
  export default {
    components: {
      BarChart,
      RouteBreadCrumb,
      StatsCard,
      TagsInput,
    },
    data() {
      return {
        bigLineChart: {
          allData: [
            [0, 20, 10, 30, 15, 40, 20, 60, 60],
            [0, 20, 5, 25, 10, 30, 15, 40, 40]
          ],
          activeIndex: 0,
          chartData: {
            datasets: [
              {
                label: 'Performance',
                data: [0, 20, 10, 30, 15, 40, 20, 60, 60],
              }
            ],
            labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          },
          extraOptions: chartConfigs.blueChartOptions,
        },
        redBarChart: {
          chartData: {
            labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
              label: 'Sales',
              data: [25, 20, 30, 22, 17, 29]
            }]
          },
          extraOptions: chartConfigs.blueChartOptions
        }
      };
    },
    methods: {
      initBigChart(index) {
        let chartData = {
          datasets: [
            {
              label: 'Performance',
              data: this.bigLineChart.allData[index]
            }
          ],
          labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        };
        this.bigLineChart.chartData = chartData;
        this.bigLineChart.activeIndex = index;
      }
    },
    mounted() {
      this.initBigChart(0);
    }
  };
</script>
<style></style>
