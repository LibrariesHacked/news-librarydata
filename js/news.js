var News = {
    load: function (callback) {
        $.get('/data/PLNStories.json', function (data) {
            var stories = [];
            $.each(Object.keys(data), function (i, type) {
                $.each(Object.keys(data[type]), function (y, year) {
                    $.each(Object.keys(data[type][year]), function (z, month) {
                        $.each(data[type][year][month], function (idx, story) {
                            story.push(type);
                            stories.push(story);
                        });
                    });
                });
            });
            callback(stories);
        });
    }
};