$(function () {

    var map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/librarieshacked/cjbr4x5c48fge2qqkqtylhv0k/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibGlicmFyaWVzaGFja2VkIiwiYSI6IlctaDdxSm8ifQ.bxf1OpyYLiriHsZN33TD2A', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18
    }).addTo(map);
    // Set up Data Table
    var data_table = $('#tbl-news').DataTable({
        responsive: true,
        data: [],
        dom: 'Bfrtip',
        buttons: ['copy', 'excel', 'pdf'],
        columns: [{
            title: 'Where'
        },
        {
            title: 'Date',
            render: function (data, type, row) {
                if (type === 'sort') {
                    return data;
                } else {
                    return moment(data).format('ddd Do MMM YYYY');
                }
            }
        },
        {
            title: 'News',
            className: 'none'
        },
        {
            title: 'Actions',
            render: function (data, type, row) {
                if (type === 'sort') {
                    return data;
                } else {
                    return '<a title="Go to Public Libraries News" target="_blank" href="http://www.publiclibrariesnews.com/' + data + '"><i class="fa fa-external-link" aria-hidden="true"></i></a>';
                }
            }
        },
        {
            title: 'Type'
        }
        ],
        order: [1, 'desc']
    });

    // Set up line chart
    var ctx = document.getElementById('cht_types_per_month').getContext('2d');
    var line = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });


    var setDataTable = function (data) {
        data_table.rows.add(data).draw();
    };


    var setLine = function () {
        $.each(Object.keys(News.type_month_counts), function (i, type) {
            line.data.labels = Object.keys(News.type_month_counts[type]);
            line.data.datasets.push({ label: type, data: Object.keys(News.type_month_counts[type]).map(function (mth, y) { return News.type_month_counts[type][mth]; }) });
        });
        line.update();
    };



    News.load(function (data) {
        // On initial load load in the data with the custom filters
        setDataTable(data);
        setLine();
    });
});