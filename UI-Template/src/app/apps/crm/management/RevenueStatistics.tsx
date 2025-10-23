
import {Card, CardBody} from 'react-bootstrap';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import CardTitle from '@/components/CardTitle';

const RevenueStatistics = () => {
    const apexLineChartWithLables: ApexOptions = {
        chart: {
            height: 361,
            type: 'line',
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 7,
                left: -7,
                top: 7
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 4
        },
        series: [{
            name: 'Budget',
            data: [10, 20, 15, 28, 22, 34 ]
        }, {
            name: 'Revenue',
            data: [2, 26, 10, 38, 30, 48]
        }],
        colors: ["#727cf5", "#0acf97"],

        xaxis: {
            type: 'category',
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            tooltip: {
                enabled: false
            },
            axisBorder: {
                show: false
            }
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    return val + "k"
                },
                offsetX: -15
            }
        }
    };

    const apexLineChartWithLablesData = [
        {
            name: 'Budget',
            data: [10, 20, 15, 28, 22, 34],
        },
        {
            name: 'Revenue',
            data: [2, 26, 10, 38, 30, 48],
        },
    ];

    return (
        <Card>
            <CardTitle
                containerClass="d-flex align-items-center justify-content-between card-header"
                title="Revenue Statistics"
                menuItems={[{label: 'Today'}, {label: 'Yesterday'}, {label: 'Last Week'}, {label: 'Last Month'}]}
            />
            <CardBody className='pt-0'>
                <Chart options={apexLineChartWithLables} series={apexLineChartWithLablesData} type="line"
                       className="apex-charts" height={361}/>
            </CardBody>
        </Card>
    );
};

export default RevenueStatistics;
