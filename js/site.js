$(function () {

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
				var base_link = 'http://www.publiclibrariesnews.com/' + data;
                if (type === 'sort') {
                    return data;
                } else {
                    var twitter_link = 'https://twitter.com/intent/tweet?url=' + encodeURI(base_link + '&text=' + row[0] + ' featured on Public Libraries News (@publiclibnews). "' + (row[2].length > 70 ? (row[2].substring(0, 70) + '...') : row[2]) + '" via @librarieshacked"');
                    return (
                        '<span class="lead"><a title="Go to Public Libraries News" target="_blank" href="' + base_link + '"><i class="fa fa-external-link-square" aria-hidden="true"></i></a>&nbsp;&nbsp;' +
                        '<a title="Share on Twitter" target="_blank" href="' + twitter_link + '"><i class="fa fa-twitter-square text-info" aria-hidden="true"></i></a></span>'
                    );
                }
            }
        },
        {
            title: 'Type'
        }
        ],
        order: [1, 'desc']
    });

    var background_colours = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)'
    ];

    var border_colours = [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
    ];

    // Set up monthly line chart
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


    // Set up locations bar chart
    var ctx_bar = document.getElementById('cht_top_locations').getContext('2d');
    var bar_locations = new Chart(ctx_bar, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    background_colours[0],
                    background_colours[1],
                    background_colours[2],
                    background_colours[3],
                    background_colours[4]
                ],
                borderColor: [
                    border_colours[0],
                    border_colours[1],
                    border_colours[2],
                    border_colours[3],
                    border_colours[4]
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                display: false
            }
        }
    });

    // 
    var setYearsBtns = function () {
        $.each(News.years, function (i, year) {
            var checked = false;
            if (News.selected_years.indexOf(year) !== -1) checked = true;
            $('#btns-years').append('<label class="btn btn-primary ' + (checked ? 'active' : '') + '"><input id="chb_year_' + year + '" type="checkbox" class="chb-years" ' + (checked ? 'checked=""' : '') + ' autocomplete="off">' + year + '</label>');
        });
        // And handle updates
        $('.chb-years').change(function (e) {
            var years_filter = [];
            $.each($('.chb-years'), function (y, c) {
                if ($(c).is(':checked')) years_filter.push(c.id.replace('chb_year_', ''));
            });
            News.selected_years = years_filter;
            News.process();
            updateGraphsAndTable();
        });
    };

    // 
    var setTypesBtns = function () {
        $.each(News.types, function (i, type) {
            var checked = false;
            if (News.selected_types.indexOf(type) !== -1) checked = true;
            $('#btns-types').append('<label class="btn btn-primary ' + (checked ? 'active' : '') + '"><input id="chb_type_' + type + '" type="checkbox" class="chb-types" ' + (checked ? 'checked=""' : '') + ' autocomplete="off">' + type + '</label>');
        });
        // And handle updates
        $('.chb-types').change(function (e) {
            var types_filter = [];
            $.each($('.chb-types'), function (y, c) {
                if ($(c).is(':checked')) types_filter.push(c.id.replace('chb_type_', ''));
            });
            News.selected_types = types_filter;
            News.process();
            updateGraphsAndTable();
        });
    };

    // 
    var setLocationList = function () {
        $.each(News.location_names, function (i, loc) {
            $('#sel-location').append($('<option>', { value: loc, text: loc }));
        });
        // And handle updates
        $('#sel-location').change(function (e) {
            var location_filter = [];
            var selected = $(e.target).val();
            if (selected !== '') location_filter.push(selected);
            News.selected_locations = location_filter;
            News.process();
            updateGraphsAndTable();
        });
    };

    // 
    var setDataTable = function () {
        data_table.clear().draw();
        data_table.rows.add(News.stories).draw();
    };

    var setLocationsChart = function () {
        var top_five = News.location_counts.slice(0, 5);
        bar_locations.data.labels = [];
        bar_locations.data.datasets[0].data = [];
        $.each(top_five, function (i, location) {
            bar_locations.data.labels.push(location[0].length > 15 ? location[0].substring(0, 15) : location[0]);
            bar_locations.data.datasets[0].data.push(location[1][0]);
        });
        bar_locations.update();
    };


    // 
    var setLine = function () {
        line.data.datasets = [];
        $.each(Object.keys(News.type_month_counts), function (i, type) {
            line.data.labels = $.map(Object.keys(News.type_month_counts[type]), function (d, i) {
                return moment(d, 'YYYYMM').format('MMM YY')
            });
            line.data.datasets.push({
                backgroundColor: [background_colours[i]],
                borderColor: [border_colours[i]],
                borderWidth: 1,
                label: type,
                data: Object.keys(News.type_month_counts[type]).map(function (mth, y) {
                    return News.type_month_counts[type][mth];
                })
            });
        });
        line.update();
    };

    // 
    var updateGraphsAndTable = function () {
        setDataTable();
        setLine();
        setLocationsChart();
    };


    // 
    News.load(function (data) {
        setYearsBtns();
        setTypesBtns();
        setLocationList();
        updateGraphsAndTable();
        $('#i-loading').hide();
    });
});