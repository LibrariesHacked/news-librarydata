$(function() {

  var map = L.map('map').setView([51.505, -0.09], 13);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibGlicmFyaWVzaGFja2VkIiwiYSI6IlctaDdxSm8ifQ.bxf1OpyYLiriHsZN33TD2A'
  }).addTo(map);
  // Set up Data Table
  $('#tbl-news').DataTable({
    responsive: true,
    data: [],
    dom: 'Bfrtip',
    buttons: ['copy', 'excel', 'pdf'],
    columns: [{
        title: 'Where'
      },
      {
        title: 'Date',
        render: function(data, type, row) {
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
        render: function(data, type, row) {
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
  var ctx = document.getElementById('cht_types_per_year').getContext('2d');
  var line = new Chart(ctx, {
    type: 'bar',
    data: Object.keys(News.type_year_counts).map(function(i, type) {
      return {
        labels: Object.keys(News.type_year_counts[type]),
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      };
    }),
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


  var setDataTable = function() {



  };


  var setLine = function() {};




  News.load(function(data) {

    // On initial load load in the data with the custom filters


  });
});