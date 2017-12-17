$(function () {

    News.load(function (data) {
        $('#tbl-news').DataTable({
            data: data,
            columns: [
                { title: "Where" },
                { title: "Date" },
                { title: "Story" },
                { title: "URL" },
                { title: "Type" }
            ]
        });
    });
});