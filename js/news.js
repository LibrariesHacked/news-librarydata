var News = {
    stories: [],
    type_month_counts: [],
    type_year_counts: [],
    load: function (callback) {
        $.get('/data/PLNStories.json', function (data) {
            var stories = [];
            var yr = {}, mth = {};
            $.each(Object.keys(data), function (i, type) {
                yr[type] = {};
                mth[type] = {};
                $.each(Object.keys(data[type]), function (y, year) {
                    yr[type][mth] = 0;
                    $.each(Object.keys(data[type][year]), function (z, month) {
                        mth[type][year + month] = 0;
                        $.each(data[type][year][month], function (idx, story) {
                            // Change the date format
                            story[1] = moment(story[1], 'ddd, DD MMM YYYY HH:mm:ss +0000').format('YYYYMMDD');
                            yr[type][year]++;
                            yr[type][year + month]++; 
                            var type_description = 'News';
                            if (type === 'changes') type_description = 'Change';
                            story.push(type_description);
                            stories.push(story);
                        });
                    }.bind(this));
                }.bind(this));
            }.bind(this));
            this.type_year_counts = yr;
            this.type_month_counts = mth;
            this.stories = stories;
            callback(stories);
        }.bind(this));
    }
};