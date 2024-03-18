import * as echarts from './ec-canvas/echarts';

export const generateOptions = (title, xAxisData, yAxisData) => {
  const newOption = {
    title: {
      text: title,
      left: 'center',
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisTick: { show: false },
      axisLabel: {
        textStyle: { color: '#000' },
        interval: 0,
      },
      axisLine: {
        lineStyle: { color: '#000' },
      },
    },
    yAxis: {
      type: 'value',
      nameTextStyle: { color: '#000' },
      minInterval: 1,
      axisTick: { show: false },
      axisLabel: { textStyle: { color: '#000' }, interval: 1, },
      axisLine: {
        lineStyle: { color: '#000' },
        show: true,
      },
      splitLine: {
        show: true,
        lineStyle: { type: 'dashed' },
      },
    },
    series: [
      {
        data: yAxisData,
        type: 'bar',
        itemStyle: {
          normal: {
            barBorderRadius: [6, 6, 0, 0],
            label: {
              show: true,
              position: 'top',
            },
            color: function (params) {
              var colorList = [
                ['#5498ff', '#89d3f6'],
                ['#0acd81', '#b7f5bf'],
                ['#ff9137', '#ffd59a'],
                ['#f97878', '#ffafaf'],
                ['#CC00FF', '#96C93D'],
                ['#B2FEFA', '#0ED2F7'],
                ['#90EE90', '#4389A2'],
              ];
              var index = params.dataIndex;
              if (params.dataIndex >= colorList.length) {
                index = params.dataIndex - colorList.length;
              }
              return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colorList[index][0] },
                { offset: 1, color: colorList[index][1] },
              ]);
            },
          },
        },
      },
      {
        data: yAxisData,
        type: 'line',
        smooth:true,
      },
    ],
    grid: {
      left: 20,
      right: 20,
      bottom: 15,
      top: '20%',
      containLabel: true,
    },
  };
  return newOption;
};
