import { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { NoSsr, IconButton } from '@material-ui/core';
import { updateProgress } from '../lib/store';
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';
import dataFetch from '../lib/data-fetch';
import { withSnackbar } from 'notistack';
import { Chart, Line } from 'react-chartjs-2';
import 'chartjs-plugin-colorschemes';
import 'chartjs-plugin-deferred';
import moment from 'moment';
import GrafanaCustomGaugeChart from './GrafanaCustomGaugeChart';
if (typeof window !== 'undefined') { 
  require('chartjs-plugin-zoom');
  // require('chartjs-plugin-streaming');
}
const grafanaStyles = theme => ({
    root: {
      width: '100%',
    },
    column: {
      flexBasis: '33.33%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    dateRangePicker: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
    iframe: {
      minHeight: theme.spacing(55),
      minWidth: theme.spacing(55),
    },
    chartjsTooltip: {
      position: 'absolute',
      background: 'rgba(0, 0, 0, .7)',
      color: 'white',
      borderRadius: '3px',
      transition: 'all .1s ease',
      pointerEvents: 'none',
      transform: 'translate(-50%, 0)',
    },
    chartjsTooltipKey: {
			display: 'inline-block',
			width: '10px',
			height: '10px',
			marginRight: '10px',
		}
  });

const grafanaDateRangeToDate = (dt, startDate) => {
  let dto = new Date();
  switch (dt) {
    case 'now-2d':
        dto.setDate(dto.getDate() - 2);
        break;
    case 'now-7d':
        dto.setDate(dto.getDate() - 7);
        break;
    case 'now-30d':
        dto.setDate(dto.getDate() - 30);
        break;
    case 'now-90d':
        dto.setDate(dto.getDate() - 90);
        break;
    case 'now-6M':
        dto.setMonth(dto.getMonth() - 6);
        break;
    case 'now-1y':
        dto.setFullYear(dto.getFullYear() - 1);
        break;
    case 'now-2y':
        dto.setFullYear(dto.getFullYear() - 2);
        break;
    case 'now-5y':
        dto.setFullYear(dto.getFullYear() - 5);
        break;
    case 'now-1d/d':
        dto.setDate(dto.getDate() - 1);
        if(startDate){
          dto.setHours(0);
          dto.setMinutes(0);
          dto.setSeconds(0);
          dto.setMilliseconds(0);
        } else {
          dto.setHours(23);
          dto.setMinutes(59);
          dto.setSeconds(59);
          dto.setMilliseconds(999);
        }
        break;
    case 'now-2d/d':
        dto.setDate(dto.getDate() - 2);
        if(startDate){
          dto.setHours(0);
          dto.setMinutes(0);
          dto.setSeconds(0);
          dto.setMilliseconds(0);
        } else {
          dto.setHours(23);
          dto.setMinutes(59);
          dto.setSeconds(59);
          dto.setMilliseconds(999);
        }
        break;
    case 'now-7d/d':
        dto.setDate(dto.getDate() - 7);
        if(startDate){
          dto.setHours(0);
          dto.setMinutes(0);
          dto.setSeconds(0);
          dto.setMilliseconds(0);
        } else {
          dto.setHours(23);
          dto.setMinutes(59);
          dto.setSeconds(59);
          dto.setMilliseconds(999);
        }
        break;
    case 'now-1w/w':
        dto.setDate(dto.getDate() - 6 - (dto.getDay() + 8) % 7);
        if(startDate){
          dto.setHours(0);
          dto.setMinutes(0);
          dto.setSeconds(0);
          dto.setMilliseconds(0);
        } else {
          dto.setDate(dto.getDate() + 6);
          dto.setHours(23);
          dto.setMinutes(59);
          dto.setSeconds(59);
          dto.setMilliseconds(999);
        }
        break;
    case 'now-1M/M':
        dto.setMonth(dto.getMonth() - 1);
        if(startDate){
          dto.setDate(1);
          dto.setHours(0);
          dto.setMinutes(0);
          dto.setSeconds(0);
          dto.setMilliseconds(0);
        } else {
          dto.setMonth(dto.getMonth());
          dto.setDate(0);
          dto.setHours(23);
          dto.setMinutes(59);
          dto.setSeconds(59);
          dto.setMilliseconds(999);
        }
        break;
    case 'now-1y/y':
        dto.setFullYear(dto.getFullYear() - 1);
        if(startDate){
          dto.setMonth(0);
          dto.setDate(1);
          dto.setHours(0);
          dto.setMinutes(0);
          dto.setSeconds(0);
          dto.setMilliseconds(0);
        } else {
          dto.setMonth(12);
          dto.setDate(0);
          dto.setHours(23);
          dto.setMinutes(59);
          dto.setSeconds(59);
          dto.setMilliseconds(999);
        }
        break;
    case 'now/d':
        dto.setDate(dto.getDate() - 6 - (dto.getDay() + 8) % 7);
        if(startDate){
          dto.setHours(0);
          dto.setMinutes(0);
          dto.setSeconds(0);
          dto.setMilliseconds(0);
        } else {
          dto.setHours(23);
          dto.setMinutes(59);
          dto.setSeconds(59);
          dto.setMilliseconds(999);
        }
        break;
    case 'now':
        break;
    case 'now/w':
        dto.setDate(dto.getDate() - (dto.getDay() + 7) % 7);
        if(startDate){
          dto.setHours(0);
          dto.setMinutes(0);
          dto.setSeconds(0);
          dto.setMilliseconds(0);
        } else {
          dto.setDate(dto.getDate() + 6);
          dto.setHours(23);
          dto.setMinutes(59);
          dto.setSeconds(59);
          dto.setMilliseconds(999);
        }
        break;
    case 'now/M':
        if(startDate){
          dto.setDate(1);
          dto.setHours(0);
          dto.setMinutes(0);
          dto.setSeconds(0);
          dto.setMilliseconds(0);
        } else {
          dto.setMonth(dto.getMonth()+1);
          dto.setDate(0);
          dto.setHours(23);
          dto.setMinutes(59);
          dto.setSeconds(59);
          dto.setMilliseconds(999);
        }
        break;
    case 'now/y':
        if(startDate){
          dto.setMonth(0);
          dto.setDate(1);
          dto.setHours(0);
          dto.setMinutes(0);
          dto.setSeconds(0);
          dto.setMilliseconds(0);
        } else {
          dto.setMonth(12);
          dto.setDate(0);
          dto.setHours(23);
          dto.setMinutes(59);
          dto.setSeconds(59);
          dto.setMilliseconds(999);
        }
        break;
    case 'now-5m':
        dto.setMinutes(dto.getMinutes() - 5);
        break;
    case 'now-15m':
        dto.setMinutes(dto.getMinutes() - 15);
        break;
    case 'now-30m':
        dto.setMinutes(dto.getMinutes() - 30);
        break;
    case 'now-1h':
        dto.setHours(dto.getHours() - 1);
        break;
    case 'now-3h':
        dto.setHours(dto.getHours() - 3);
        break;
    case 'now-6h':
        dto.setHours(dto.getHours() - 6);
        break;
    case 'now-12h':
        dto.setHours(dto.getHours() - 12);
        break;
    case 'now-24h':
        dto.setHours(dto.getHours() - 24);
        break;
    default:
      return new Date(parseFloat(dt));
  }
  return dto;
}

class GrafanaCustomChart extends Component {
    
    constructor(props){
      super(props);
      this.timeFormat = 'MM/DD/YYYY HH:mm:ss';
      this.panelType = '';
      switch(props.panel.type){
        case 'graph':
          this.panelType = props.panel.type;
          break;
        case 'singlestat':
          this.panelType = props.panel.type ==='singlestat' && props.panel.sparkline && props.panel.sparkline.show === true?'sparkline':'gauge';
          break;
      }
      
      this.datasetIndex = {};
      this.state = {
        chartData: {
          datasets: [],
          labels: [],
        },
        options: {},
        error: '',
      };
    }

    componentDidMount() {
      this.configChartData();
    }

    configureChartJSTooltip(){
      const {classes} = this.props;
      const self = this;
      return function(tooltip) {
        // Tooltip Element
        var tooltipEl = self.tooltip;
        // Hide if no tooltip
        if (tooltip.opacity === 0) {
          tooltipEl.style.opacity = 0;
          return;
        }
        // Set caret Position
        // tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltip.yAlign) {
          tooltipEl.classList.add(tooltip.yAlign);
        } else {
          tooltipEl.classList.add('no-transform');
        }
        // Set Text
        if (tooltip.body) {
          var titleLines = tooltip.title || [];
          var bodyLines = tooltip.body.map(bodyItem => {
            return bodyItem.lines;
          });
          var innerHtml = '<thead>';
          titleLines.forEach(title => {
            innerHtml += '<tr><th>' + title + '</th></tr>';
          });
          innerHtml += '</thead><tbody>';
          bodyLines.forEach((body, i) => {
            var colors = tooltip.labelColors[i];
            var style = 'background:' + colors.backgroundColor;
            style += '; border-color:' + colors.borderColor;
            style += '; border-width: 2px';
            var span = '<span class="'+ classes.chartjsTooltipKey +'" style="' + style + '"></span>';
            innerHtml += '<tr><td>' + span + body + '</td></tr>';
          });
          innerHtml += '</tbody>';
          var tableRoot = tooltipEl.querySelector('table');
          tableRoot.innerHTML = innerHtml;
        }
        var positionY = this._chart.canvas.offsetTop;
        var positionX = this._chart.canvas.offsetLeft;
        // Display, position, and set styles for font
        tooltipEl.style.opacity = 1;
        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
        tooltipEl.style.top = positionY + tooltip.caretY + 'px';
        tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
        tooltipEl.style.fontSize = `${tooltip.bodyFontSize}px`;
        tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
        tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
      };
    }

    configChartData = () => {
      const { panel, refresh, liveTail } = this.props;
      const self = this;

      if(panel.targets){
        panel.targets.forEach((target, ind) => {
          self.datasetIndex[`${ind}_0`] = ind;
        }); 
      }
      if(typeof self.interval !== 'undefined'){
        clearInterval(self.interval);
      }
      if(liveTail){
        self.interval = setInterval(function(){
          self.collectChartData();
        }, self.computeRefreshInterval(refresh)*1000);
      }
      self.collectChartData();
    }

    getOrCreateIndex(datasetInd) {
      if(typeof this.datasetIndex[datasetInd] !== 'undefined'){
        return this.datasetIndex[datasetInd];
      }
      let max = 0;
      Object.keys(this.datasetIndex).forEach(i => {
        if(this.datasetIndex[i] > max){
          max = this.datasetIndex[i];
        }
      });
      this.datasetIndex[datasetInd] = max+1;
      return max+1;
    }

    collectChartData = (chartInst) => {
      const { panel } = this.props;
      const self = this;
      if(panel.targets){
        panel.targets.forEach((target, ind) => {
          self.getData(ind, target, chartInst);
        });
      }
    }

    getData = async (ind, target, chartInst) => {
      const {prometheusURL, grafanaURL, grafanaAPIKey, panel, from, to, templateVars, liveTail} = this.props;
      const {data, chartData} = this.state;

      const cd = (typeof chartInst === 'undefined'?chartData:chartInst.data);
      let queryRangeURL = '';
      if (prometheusURL && prometheusURL !== ''){
        queryRangeURL = `/api/prometheus/query_range`;
      } else if (grafanaURL && grafanaURL !== ''){
        // grafanaURL = grafanaURL.substring(0, grafanaURL.length - 1);
        queryRangeURL = `/api/grafana/query_range`;
      }
      const self = this;
      let expr = target.expr;
      templateVars.forEach(tv => {
        const tvrs = tv.split('=');
        if (tvrs.length == 2){
          expr = expr.replace(new RegExp(`$${tvrs[0]}`.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'),tvrs[1]);
        }
      });
      
      const start = Math.round(grafanaDateRangeToDate(from).getTime()/1000);
      const end = Math.round(grafanaDateRangeToDate(to).getTime()/1000);
      const queryParams = `ds=${panel.datasource}&query=${encodeURIComponent(expr)}&start=${start}&end=${end}&step=10`; // step 5 or 10
      // TODO: need to check if it is ok to use datasource name instead of ID
                
      dataFetch(`${queryRangeURL}?${queryParams}`, { 
        method: 'GET',
        credentials: 'include',
        // headers: headers,
      }, result => {
        self.props.updateProgress({showProgress: false});
        if (typeof result !== 'undefined'){
          const fullData = self.transformDataForChart(result, target);
          fullData.forEach(({metric, data}, di) => {
            const datasetInd = self.getOrCreateIndex(`${ind}_${di}`);
            const newData = [];

            if (typeof cd.labels[datasetInd] === 'undefined' || typeof cd.datasets[datasetInd] === 'undefined'){
              let legend = typeof target.legendFormat !== 'undefined'?target.legendFormat:'';
              if(legend === '') {
                legend = Object.keys(metric).length > 0?JSON.stringify(metric):'';
              } else{
                Object.keys(metric).forEach(metricKey => {
                  legend = legend.replace(`{{${metricKey}}}`, metric[metricKey])
                              .replace(`{{ ${metricKey} }}`, metric[metricKey]);
                });
                legend = legend.replace(`{{ `, '').replace(`{{`, '')
                            .replace(` }}`, '').replace(`}}`, '');
              }
              cd.labels[datasetInd] = legend;
              cd.datasets[datasetInd] = {
                label: legend,
                data: [],
                pointRadius: 0,
                // fill: false,
                fill: true,
              };
              if(self.panelType === 'sparkline' && panel.sparkline && panel.sparkline.lineColor && panel.sparkline.fillColor){
                cd.datasets[datasetInd].borderColor = panel.sparkline.lineColor;
                cd.datasets[datasetInd].backgroundColor = panel.sparkline.fillColor;
              }
            }
            data.forEach(({x, y}) => {
              let toadd = true;
              cd.datasets[datasetInd].data.forEach(({x: x1, y: y1}) => {
                if(x === x1) {
                  toadd = false;
                }
              });
              if(toadd){
                newData.push({x, y});  
              }
            });
            Array.prototype.push.apply(cd.datasets[datasetInd].data, newData);
            cd.datasets[datasetInd].data.sort((a, b) => {
              return new Date(a.x).getTime() - new Date(b.x).getTime();
            })
          });
          if(typeof chartInst === 'undefined'){
            for(let cddi=0;cddi < cd.datasets.length; cddi++){
              if(typeof cd.datasets[cddi] === 'undefined'){
                cd.datasets[cddi] = {data:[], label: ''};
              }
            }
            self.setState({chartData, options: self.createOptions(), error:''});
          } else {
            chartInst.update({
              preservation: true,
            });
          }
        }
      }, self.handleError);
    }

    transformDataForChart(data, target) {
      if (data && data.status === 'success' && data.data && data.data.resultType && data.data.resultType === 'matrix' 
          && data.data.result && data.data.result.length > 0){
            let fullData = [];
            data.data.result.forEach(r => {
              const localData = r.values.map(arr => {
                const x = moment(arr[0] * 1000).format(this.timeFormat);
                const y = parseFloat(parseFloat(arr[1]).toFixed(2));
                return {
                  x,
                  y,
                };
              })
              fullData.push({
                data: localData,
                metric: r.metric,
              })
            })
            return fullData;
      }
      return [];
    }

    showMessageInChart(){
      var self = this;
      return function(chart) {
        // const {error} = this.state;
        // if (chart.data.datasets.length === 0) {
        var ctx = chart.chart.ctx;
        var width = chart.chart.width;
        if(self.state.error !== ''){
          var height = 5 //chart.chart.height;
          // chart.clear();
          
          // ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = "bold 16px 'Helvetica Nueue'";
          // ctx.fillText(chart.options.title.text, width / 2, 18);
          ctx.fillStyle = '#D32F2F';
          ctx.fillText(`There was an error communicating with the server`, width/2, 40);
          ctx.restore();
        } 
        if (self.panelType && self.panelType === 'sparkline'){
          if(chart.data.datasets.length > 0 && chart.data.datasets[0].data.length > 0){
            const dind = chart.data.datasets[0].data.length - 1;
            // ctx.fillStyle = '#D32F2F';
            const val = chart.data.datasets[0].data[dind].y;
            const unit = chart.options.scales.yAxes[0].scaleLabel.labelString;
            let msg = '';
            if (!isNaN(val)){
              if(unit.startsWith('percent')){
                const mulFactor = unit.toLowerCase() === 'percentunit'?100:1;
                msg = `${(val*mulFactor).toFixed(2)}%`;
              } else {
                msg = `${val} ${unit}`;
              }
            }

            var height = chart.chart.height;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = "bold 36px 'Helvetica Nueue'";
            ctx.fillStyle = '#000000';
            ctx.fillText(msg, width/2, height/2);
            ctx.restore();
          }
        }
      }
    }

    updateDateRange(){
      const self = this;
      let tm;
      return  function({chart}){
        if (typeof tm !== 'undefined'){
          clearTimeout(tm);
        }
        if(typeof chart !== 'undefined'){
          let min = chart.scales["x-axis-0"].min;
          let max = chart.scales["x-axis-0"].max;
          tm = setTimeout(function(){
            if(!isNaN(min) && !isNaN(max)){
              min = Math.floor(min);
              max = Math.floor(max);
              self.props.updateDateRange(`${min}`, new Date(min), `${max}`, new Date(max), false, self.props.refresh);
            } else {
              self.props.updateDateRange(self.props.from, self.props.startDate, self.props.to, self.props.endDate, self.props.liveTail, self.props.refresh);  
            }
          }, 1000);
        }
        return false;
      }
    }

    createOptions() {
      const {panel, from, to} = this.props;
      const fromDate = grafanaDateRangeToDate(from);
      const toDate = grafanaDateRangeToDate(to);
      const self = this;

      const showAxis = panel.type ==='singlestat' && panel.sparkline && panel.sparkline.show === true?false:true;

      const yAxes = {
        stacked: (typeof panel.stack !== 'undefined' && panel.stack?true:false),
        type: 'linear',
        display: showAxis,
        gridLines: {
          display: showAxis,
        },
      };
      if(panel.yaxes){
        panel.yaxes.forEach(ya => {
          if(typeof ya.label !== 'undefined' && ya.label !== null){
            yAxes.scaleLabel = {
              display: true,
              labelString: ya.label,
            };
          }
          if(ya.format.toLowerCase().startsWith('percent')){
            const mulFactor = ya.format.toLowerCase() === 'percentunit'?100:1;
            yAxes.ticks = {
              callback: function(tick) {
                const tk = (tick * mulFactor).toFixed(2);
                return `${tk}%`;
              }
            }
          }
        });
      }
      if(self.panelType === 'sparkline'){
        yAxes.scaleLabel = {
          display: false,
          labelString: panel.format,
        };
      }
      const xAxes = {
        type: 'time',
        display: showAxis,
        time: {
          min: fromDate.getTime(),
          max: toDate.getTime(),
        },
      };

      if (!showAxis) {
        xAxes.gridLines = {
            display: showAxis,
        };
        yAxes.gridLines = {
          display: showAxis,
        };
      }

      // panel.xaxes.forEach(ya => {
      //   if(ya.label !== null){
      //     yAxes.scaleLabel = {
      //       display: true,
      //       labelString: ya.label,
      //     };
      //   }
      // });
      let shouldDisplayLegend = Object.keys(this.datasetIndex).length <= 10?true:false;
      if(panel.type !== 'graph'){
        shouldDisplayLegend = false;
      }
        
      return {
          plugins: {
            deferred: {
              xOffset: 150,
              yOffset: '50%',
              delay: 500
            },
            colorschemes: {
              // scheme: 'office.Office2007-2010-6'
              scheme: 'brewer.RdYlGn4',
              fillAlpha: 0.15,
            },
            // streaming: false,
          },
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: panel.title
          },
          tooltips: {
            enabled: showAxis,
            mode: 'index',
            // mode: 'nearest',
            intersect: false,
            // enabled: false,
            // custom: self.configureChartJSTooltip(),
          },
          hover: {
            mode: 'nearest',
            intersect: false,
          },
          legend: {
            position: 'bottom',
            display: shouldDisplayLegend,
            // fullWidth: false,
            labels: {
              // fontStyle: 'normal',
              fontSize: 10,
              // padding: 5,
              usePointStyle: true,
            },
          },
          pan: {
            enabled: panel.type === 'graph'?true:false,
            mode: 'x',
            rangeMin: {
                x: null
            },
            rangeMax: {
                x: null
            },
            onPan: self.updateDateRange(),
          },
          zoom: {
              enabled: panel.type === 'graph'?true:false,
              // drag: true, // if set to true will turn off pinch
              mode: 'x',
              speed: 0.05,
              rangeMin: {
                  x: null
              },
              rangeMax: {
                  x: null
              },
              onZoom: self.updateDateRange(),
          },
          scales: {
            xAxes: [xAxes],
            yAxes: [yAxes],
          },
        }
    }

    componentWillUnmount(){
      if(typeof this.interval !== 'undefined'){
        clearInterval(this.interval);
      }
    }

    computeRefreshInterval = (refresh) => {
      refresh = refresh.toLowerCase();
      const l = refresh.length;
      const dur = refresh.substring(l - 1, l);
      refresh = refresh.substring(0, l - 1);
      let val = parseInt(refresh);
      switch (dur){
        case 'd':
          val *= 24;
        case 'h':
          val *= 60;
        case 'm':
          val *= 60;
        case 's':
          return val;
      }
      return 30; // fallback
    }
  
    handleError = error => {
      const self = this;
      this.props.updateProgress({showProgress: false});
      this.setState({error: error.message && error.message !== ''?error.message:(error !== ''?error:'')});
      // this.props.enqueueSnackbar(`There was an error communicating with Grafana`, {
      //   variant: 'error',
      //   action: (key) => (
      //     <IconButton
      //           key="close"
      //           aria-label="Close"
      //           color="inherit"
      //           onClick={() => self.props.closeSnackbar(key) }
      //         >
      //           <CloseIcon />
      //     </IconButton>
      //   ),
      //   autoHideDuration: 1000,
      // });
    }
    
    render() {
      const { classes, panel } = this.props;
      const {chartData, options, error} = this.state;
      let finalChartData = {
        datasets: [],
        labels: [],
      }
      const filteredData = chartData.datasets.filter(x => typeof x !== 'undefined')
      if(chartData.datasets.length === filteredData.length){
        finalChartData = chartData;
      }
      if(this.panelType === 'gauge'){
        return (
          <NoSsr>
            <GrafanaCustomGaugeChart
              data={finalChartData}
              panel={panel}
              error={error}
            />
          </NoSsr>
        );
      } else {
        return (
          <NoSsr>
            <Line data={finalChartData} options={options} plugins={[
              {
                afterDraw: this.showMessageInChart(),
              }
            ]} />
            <div className={classes.chartjsTooltip} ref={tp => this.tooltip = tp}>
              <table></table>
            </div>
          </NoSsr>
        );
      }
    }
}

GrafanaCustomChart.propTypes = {
  classes: PropTypes.object.isRequired,
  grafanaURL: PropTypes.string.isRequired,
  grafanaAPIKey: PropTypes.string.isRequired,
  board: PropTypes.object.isRequired,
  panel: PropTypes.object.isRequired,
  templateVars: PropTypes.array.isRequired,
  updateDateRange: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => {
  return {
      updateProgress: bindActionCreators(updateProgress, dispatch),
  }
}

export default withStyles(grafanaStyles)(connect(
  null,
  mapDispatchToProps
)(withSnackbar(GrafanaCustomChart)));