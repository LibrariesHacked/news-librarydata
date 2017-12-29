var News = {
    story_data: {},
    location_data: {},
    years: [],
    types: [],
    selected_years: ['2017', '2018'],
    selected_types: ['changes', 'local'],
    stories: [],
    type_month_counts: [],
    type_year_counts: [],
    location_counts: [],
    load: function (callback) {
        $.when($.get('/data/PLNStories.json'), $.get('/data/PLNLocations.json'))
            .done(function (story_data, location_data) {
                this.story_data = story_data[0];
                this.location_data = location_data[0];
                this.process();
                callback(this.stories);
            }.bind(this));
    },
    process: function () {
        var stories = [];
        var yr = {},
            mth = {},
            locations = {};
        $.each(Object.keys(this.story_data), function (i, type) {
            this.types.push(type);
            yr[type] = {};
            mth[type] = {};
            if (this.selected_types.indexOf(type) !== -1) {
                $.each(Object.keys(this.story_data[type]), function (y, year) {
                    this.years.push(year);
                    yr[type][mth] = 0;
                    if (this.selected_years.indexOf(year) !== -1) {
                        $.each(Object.keys(this.story_data[type][year]), function (z, month) {
                            mth[type][year + month] = 0;
                            $.each(this.story_data[type][year][month], function (idx, story) {
                                // Change the date format
                                if (!locations[story[1]]) locations[story[1]] = [0, 0, 0];
                                locations[story[1]][0] = locations[story[1]][0] + 1;
                                $.each(Object.keys(this.location_data), function (y, loc) {
                                    if (loc === story[1]) {
                                        locations[story[1]][1] = this.location_data[loc][0];
                                        locations[story[1]][2] = this.location_data[loc][1];
                                    }
                                });
                                story[1] = moment(story[1], 'ddd, DD MMM YYYY HH:mm:ss +0000').format('YYYYMMDD');
                                mth[type][year + month] = mth[type][year + month] + 1;
                                yr[type][year] = yr[type][year] + 1;
                                var type_description = 'News';
                                if (type === 'changes') type_description = 'Change';
                                story.push(type_description);
                                stories.push(story);
                            }.bind(this));
                        }.bind(this));
                    }
                }.bind(this));
            }
        }.bind(this));
        $.each(Object.keys(locations), function (i, loc) {
            this.location_counts.push([loc, locations[loc]]);
        }.bind(this));
        this.location_counts = this.location_counts.sort(function (a, b) {
            return b[1] - a[1]
        })
        this.type_year_counts = yr;
        this.type_month_counts = mth;
        this.stories = stories;
    }
};