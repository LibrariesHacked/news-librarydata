var News = {
    story_data: {},
    location_data: {},
    years: [],
    types: [],
    selected_years: ['2018'],
    selected_types: ['News', 'Change'],
    selected_locations: [],
    stories: [],
    type_month_counts: [],
    type_year_counts: [],
    location_counts: [],
    location_names: [],
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
        this.location_counts = [];
        this.location_names = [];
        this.type_year_counts = [];
        this.type_month_counts = [];
        this.stories = [];
        var stories = [];
        var yr = {},
            mth = {},
            locations = {};
        $.each(Object.keys(this.story_data), function (i, type) {
            var type_description = ''
            if (type === 'local') type_description = 'News';
            if (type === 'changes') type_description = 'Change';
            yr[type_description] = {};
            mth[type_description] = {};
            if (this.types.indexOf(type_description) === -1) this.types.push(type_description);
            if (this.selected_types.indexOf(type_description) !== -1) {
                $.each(Object.keys(this.story_data[type]), function (y, year) {
                    if (this.years.indexOf(year) === -1) this.years.push(year);
                    yr[type_description][year] = 0;
                    if (this.selected_years.indexOf(year) !== -1) {
                        $.each(Object.keys(this.story_data[type][year]), function (z, month) {
                            mth[type_description][year + month] = 0;
                            $.each(this.story_data[type][year][month], function (idx, story) {
                                if (this.location_names.indexOf(story[0]) === -1) this.location_names.push(story[0]);
                                if (this.selected_locations.indexOf(story[0]) !== -1 || this.selected_locations.length === 0) {
                                    var new_story = [
                                        story[0],
                                        moment(story[1], 'ddd, DD MMM YYYY HH:mm:ss +0000').format('YYYY/MM/DD'),
                                        story[2],
                                        story[3],
                                        type_description
                                    ];
                                    // Change the date format
                                    if (!locations[story[0]]) locations[story[0]] = [0, 0, 0];
                                    locations[story[0]][0] = locations[story[0]][0] + 1;
                                    $.each(Object.keys(this.location_data), function (y, loc) {
                                        if (loc === story[1]) {
                                            locations[story[0]][1] = this.location_data[loc][0];
                                            locations[story[0]][2] = this.location_data[loc][1];
                                        }
                                    });
                                    mth[type_description][year + month] = mth[type_description][year + month] + 1;
                                    yr[type_description][year] = yr[type_description][year] + 1;
                                    stories.push(new_story);
                                }
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
            return b[1][0] - a[1][0]
        })
        this.type_year_counts = yr;
        this.type_month_counts = mth;
        this.stories = stories;
        this.location_names = this.location_names.sort();
    }
};