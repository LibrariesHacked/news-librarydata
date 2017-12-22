$(function () {

    News.load(function (data) {
        $('#tbl-news').DataTable({
            responsive: true,
            data: data,
            columns: [
                { title: 'Where' },
                { title: 'Date' },
                { title: 'Story', className: 'none' },
                { title: 'Actions' },
                { title: 'Type' }
            ],
            order: [1, 'asc']
        });
    });
});