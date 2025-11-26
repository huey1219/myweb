// 設備數據模型
const devicesData = {
    ac: {
        name: '冷氣',
        status: true,
        power: 2.8,
        icon: '❄️'
    },
    light: {
        name: '燈',
        status: true,
        power: 0.15,
        icon: '💡'
    },
    tv: {
        name: '電視',
        status: false,
        power: 1.5,
        icon: '📺'
    },
    fridge: {
        name: '冰箱',
        status: true,
        power: 0.45,
        icon: '🧊'
    }
};

// 用電數據（模擬本週數據）
const weeklyPowerData = [
    { day: '周一', power: 145.2 },
    { day: '周二', power: 152.8 },
    { day: '周三', power: 138.5 },
    { day: '周四', power: 165.3 },
    { day: '周五', power: 172.1 },
    { day: '周六', power: 189.4 },
    { day: '周日', power: 156.2 }
];

// 用電數據（模擬本月數據）
const monthlyPowerData = [
    { day: '第1周', power: 1159.2 },
    { day: '第2周', power: 1245.6 },
    { day: '第3周', power: 1182.4 },
    { day: '第4周', power: 1328.7 }
];

// 每小時用電數據
const hourlyPowerData = [
    { hour: '0:00', power: 1.2 },
    { hour: '1:00', power: 0.9 },
    { hour: '2:00', power: 0.8 },
    { hour: '3:00', power: 0.7 },
    { hour: '4:00', power: 0.8 },
    { hour: '5:00', power: 1.1 },
    { hour: '6:00', power: 1.5 },
    { hour: '7:00', power: 2.3 },
    { hour: '8:00', power: 3.1 },
    { hour: '9:00', power: 3.8 },
    { hour: '10:00', power: 4.2 },
    { hour: '11:00', power: 4.5 },
    { hour: '12:00', power: 4.3 },
    { hour: '13:00', power: 4.1 },
    { hour: '14:00', power: 4.8 },
    { hour: '15:00', power: 4.7 },
    { hour: '16:00', power: 4.2 },
    { hour: '17:00', power: 4.0 },
    { hour: '18:00', power: 4.6 },
    { hour: '19:00', power: 4.9 },
    { hour: '20:00', power: 4.4 },
    { hour: '21:00', power: 3.8 },
    { hour: '22:00', power: 3.2 },
    { hour: '23:00', power: 2.1 }
];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeClock();
    initializeDevices();
    initializePowerChart('week');
    initializePeakHoursChart();
    initializeRanking();
    attachEventListeners();
});

// 初始化時鐘
function initializeClock() {
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('zh-TW', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        document.getElementById('currentTime').textContent = `現在時間: ${timeString}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// 初始化設備
function initializeDevices() {
    updateDeviceDisplays();
    updatePowerStats();
}

// 更新所有設備顯示
function updateDeviceDisplays() {
    Object.keys(devicesData).forEach(deviceKey => {
        const device = devicesData[deviceKey];
        const statusElement = document.getElementById(`${deviceKey}-status`);
        const powerElement = document.getElementById(`${deviceKey}-power`);
        const buttonElement = document.querySelector(`[data-device="${deviceKey}"]`);
        const cardElement = buttonElement.closest('.device-card');
        
        if (device.status) {
            statusElement.textContent = '開啟中';
            statusElement.style.color = '#00ff99';
            powerElement.textContent = `${device.power} kW`;
            buttonElement.textContent = '關閉';
            cardElement.classList.add('on');
            cardElement.classList.remove('off');
        } else {
            statusElement.textContent = '關閉中';
            statusElement.style.color = '#ff6666';
            powerElement.textContent = '0 kW';
            buttonElement.textContent = '開啟';
            cardElement.classList.remove('on');
            cardElement.classList.add('off');
        }
    });
}

// 更新用電統計
function updatePowerStats() {
    const currentPowerData = document.querySelector('.toggle-btn.active').getAttribute('data-mode') === 'week' 
        ? weeklyPowerData 
        : monthlyPowerData;
    
    const totalPower = currentPowerData.reduce((sum, item) => sum + item.power, 0);
    const avgPower = (totalPower / currentPowerData.length).toFixed(1);
    
    document.getElementById('totalPower').textContent = `${totalPower.toFixed(1)} kWh`;
    document.getElementById('avgPower').textContent = 
        document.querySelector('.toggle-btn.active').getAttribute('data-mode') === 'week'
            ? `${avgPower} kWh/天`
            : `${avgPower} kWh/周`;
}

// 初始化用電量圖表
function initializePowerChart(mode = 'week') {
    const data = mode === 'week' ? weeklyPowerData : monthlyPowerData;
    const categories = data.map(item => item.day);
    const powerValues = data.map(item => item.power);
    
    Highcharts.chart('powerChart', {
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
            style: {
                fontFamily: 'Segoe UI, sans-serif'
            }
        },
        title: {
            text: null
        },
        xAxis: {
            categories: categories,
            labels: {
                style: {
                    color: '#a0a0ff'
                }
            },
            lineColor: '#00d9ff',
            tickColor: '#00d9ff'
        },
        yAxis: {
            title: {
                text: null
            },
            labels: {
                style: {
                    color: '#a0a0ff'
                }
            },
            gridLineColor: 'rgba(0, 217, 255, 0.1)'
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,
                    color: '#00ff99',
                    style: {
                        fontSize: '11px'
                    }
                },
                borderColor: '#00d9ff',
                borderWidth: 1
            }
        },
        series: [{
            name: '用電量',
            data: powerValues,
            color: 'rgba(0, 217, 255, 0.7)'
        }],
        tooltip: {
            backgroundColor: 'rgba(10, 14, 39, 0.95)',
            borderColor: '#00d9ff',
            style: {
                color: '#e0e0e0'
            },
            formatter: function() {
                return `<b>${this.x}</b><br/>${this.y} kWh`;
            }
        },
        credits: {
            enabled: false
        }
    });
}

// 初始化尖峰時段圖表
function initializePeakHoursChart() {
    const categories = hourlyPowerData.map(item => item.hour);
    const powerValues = hourlyPowerData.map(item => item.power);
    
    // 找出最高時段
    const maxPower = Math.max(...powerValues);
    const maxIndex = powerValues.indexOf(maxPower);
    
    document.getElementById('peakTime').textContent = 
        `${categories[maxIndex]}-${categories[(maxIndex + 1) % 24]}`;
    document.getElementById('peakValue').textContent = `${maxPower.toFixed(1)} kWh`;
    
    Highcharts.chart('peakHoursChart', {
        chart: {
            type: 'area',
            backgroundColor: 'transparent',
            style: {
                fontFamily: 'Segoe UI, sans-serif'
            }
        },
        title: {
            text: null
        },
        xAxis: {
            categories: categories,
            labels: {
                style: {
                    color: '#a0a0ff'
                },
                step: 2
            },
            lineColor: '#00d9ff',
            tickColor: '#00d9ff'
        },
        yAxis: {
            title: {
                text: null
            },
            labels: {
                style: {
                    color: '#a0a0ff'
                }
            },
            gridLineColor: 'rgba(0, 217, 255, 0.1)'
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillOpacity: 0.3,
                lineWidth: 2
            }
        },
        series: [{
            name: '用電量',
            data: powerValues,
            color: '#ff9900'
        }],
        tooltip: {
            backgroundColor: 'rgba(10, 14, 39, 0.95)',
            borderColor: '#ff9900',
            style: {
                color: '#e0e0e0'
            },
            formatter: function() {
                return `<b>${this.x}</b><br/>${this.y} kWh`;
            }
        },
        credits: {
            enabled: false
        }
    });
}

// 初始化排行榜
function initializeRanking() {
    // 根據當前設備狀態計算排行
    const activePowers = Object.entries(devicesData)
        .filter(([key, device]) => device.status)
        .map(([key, device]) => ({
            key: key,
            name: device.name,
            power: device.power
        }))
        .sort((a, b) => b.power - a.power);
    
    // 補充關閉的設備
    const allDevices = Object.entries(devicesData)
        .map(([key, device]) => ({
            key: key,
            name: device.name,
            power: device.status ? device.power : 0
        }))
        .sort((a, b) => b.power - a.power);
    
    for (let i = 0; i < Math.min(3, allDevices.length); i++) {
        const device = allDevices[i];
        document.getElementById(`rank${i + 1}-name`).textContent = device.name;
        document.getElementById(`rank${i + 1}-power`).textContent = 
            device.power > 0 ? `${device.power} kW` : '0 kW';
    }
}

// 設備切換事件
function attachEventListeners() {
    // 設備開關按鈕
    document.querySelectorAll('.device-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const deviceKey = this.getAttribute('data-device');
            devicesData[deviceKey].status = !devicesData[deviceKey].status;
            updateDeviceDisplays();
            initializeRanking();
        });
    });
    
    // 用電量模式切換按鈕
    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.addEventListener('click', function() {
            // 移除其他按鈕的active類
            document.querySelectorAll('.toggle-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            // 添加當前按鈕的active類
            this.classList.add('active');
            
            const mode = this.getAttribute('data-mode');
            initializePowerChart(mode);
            updatePowerStats();
        });
    });
}

// 模擬實時數據更新
setInterval(function() {
    // 隨機更新冷氣功率（模擬實時變化）
    if (devicesData.ac.status) {
        devicesData.ac.power = (2.5 + Math.random() * 0.6).toFixed(2);
        document.getElementById('ac-power').textContent = `${devicesData.ac.power} kW`;
    }
    
    // 隨機更新燈光功率
    if (devicesData.light.status) {
        devicesData.light.power = (0.12 + Math.random() * 0.08).toFixed(2);
        document.getElementById('light-power').textContent = `${devicesData.light.power} kW`;
    }
    
    // 更新排行榜
    initializeRanking();
}, 3000);
