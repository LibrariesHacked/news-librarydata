"""Web scrapes Public library news posts for news items """

import json
import lxml
import requests

from bs4 import BeautifulSoup
from datetime import datetime
from pathlib import Path
from datetime import datetime

FEED = 'https://www.publiclibrariesnews.com/feed?paged='


def run():
    """Runs the main script"""

    posts = []
    locations = []

    data_folder = Path('./data/')

    posts_file_name = data_folder / 'posts.json'
    with open(posts_file_name) as posts_file:
        posts = json.load(posts_file)

    locations_file_name = data_folder / 'locations.json'
    with open(locations_file_name) as locations_file:
        locations = json.load(locations_file)

    post_dates = map(lambda post: datetime.strptime(
        post.date, '%b %d %Y %I:%M%p'), posts)

    page = 1
    more = True
    while more:
        posts_xml_string = requests.get(
            FEED + str(page), headers={'User-Agent': 'Mozilla/5.0'})
        posts_xml = BeautifulSoup(posts_xml_string.text, features='xml')
        posts = posts_xml.find_all('item')
        for post in posts:
            post_date = post.find('pubDate').text
            post_title = post.find('title').text
            post_link = post.find('link').text
        if len(posts) == 0:
            more = False
            page = page + 1


run()
