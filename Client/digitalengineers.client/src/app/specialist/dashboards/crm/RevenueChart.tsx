
import CardTitle from '@/components/CardTitle';
import type { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import {Card, Row, Col, CardBody} from 'react-bootstrap';

const RevenueChart = () => {
    const apexLineChartWithLables: ApexOptions = {
        chart: {
            height: 336,
            type: 'line',
            toolbar: {
                show: false,
            },
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        fill: {
            type: 'solid',
            opacity: [0.35, 1],
        },
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        markers: {
            size: 0,
        },
        colors: ['#0acf97', '#fa5c7c'],
        yaxis: [
            {
                title: {
                    text: 'Revenue (USD)',
                },
                min: 0,
            },
        ],
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: function (y) {
                    if (typeof y !== 'undefined') {
                        return y.toFixed(0) + 'k';
                    }
                    return y;
                },
            },
        },
        grid: {
            borderColor: '#f1f3fa',
        },
        legend: {
            fontSize: '14px',
            fontFamily: '14px',
            offsetY: 10,
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    yaxis: {
                        show: false,
                    },
                    legend: {
                        show: false,
                    },
                },
            },
        ],
    };

    const apexLineChartWithLablesData = [
        {
            name: 'Total Revenue',
            type: 'area',
            data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33, 43],
        },
        {
            name: 'Total Pipeline',
            type: 'line',
            data: [55, 69, 45, 61, 43, 54, 37, 52, 44, 61, 43, 56],
        },
    ];

    return (
        <Card>
            <CardTitle
                containerClass="card-header d-flex justify-content-between align-items-center"
                title="Revenue"
                menuItems={[{label: 'Today'}, {label: 'Yesterday'}, {label: 'Last Week'}, {label: 'Last Month'}]}
            />
            <CardBody className='p-0'>
                <div className="bg-light bg-opacity-25 border-top border-bottom border-light border-dashed">
                    <Row className="text-center">
                        <Col sm={6}>
                            <p className="text-muted mb-0 mt-3">Current Month</p>
                            <h2 className="fw-normal mb-3">
                                <span>$42,025</span>
                            </h2>
                        </Col>
                        <Col sm={6}>
                            <p className="text-muted mb-0 mt-3">Previous Month</p>
                            <h2 className="fw-normal mb-3">
                                <span>$74,651</span>
                            </h2>
                        </Col>
                    </Row>
                </div>
            </CardBody>
            <CardBody>
                <div dir="ltr">
                    <Chart options={apexLineChartWithLables} series={apexLineChartWithLablesData} type="line"
                           className="apex-charts" height={339}/>
                </div>
            </CardBody>
        </Card>
    );
};

export default RevenueChart;
