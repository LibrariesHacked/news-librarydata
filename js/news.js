var News = {
    stories: [],
    type_month_counts: [],
    type_year_counts: [],
    location_counts: [],
    load: function (callback) {
        $.when($.get('/data/PLNStories.json'), $.get('/data/Locations.json'))
          .done(function (story_data, location_data) {
            var stories = [];
            var yr = {}, mth = {}, locations = {};
            $.each(Object.keys(story_data), function (i, type) {
                yr[type] = {};
                mth[type] = {};
                $.each(Object.keys(story_data[type]), function (y, year) {
                    yr[type][mth] = 0;
                    $.each(Object.keys(story_data[type][year]), function (z, month) {
                        mth[type][year + month] = 0;
                        $.each(story_data[type][year][month], function (idx, story) {
                            // Change the date format
                            if (!locations[story[1]]) locations[story[1]] = 0;
                            locations[story[1]] = locations[story[1]] + 1;
                            $.each(location_data, function(){
                              
                            });
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
            $.each(Object.keys(locations), function (i, loc) {
              this.location_counts.push([loc, locations[loc]]);
            }.bind(this));
            this.location_counts = this.location_counts.sort(function(a, b){ return b[1] - a[1]})
            this.type_year_counts = yr;
            this.type_month_counts = mth;
            this.stories = stories;
            callback(stories);
        }.bind(this));
    }
};