"""Web scrapes Public library news posts for news items """
import requests
import lxml
from bs4 import BeautifulSoup

FEED = 'https://www.publiclibrariesnews.com/feed?paged='

def run():
  """Runs the main script"""
  page = 1
  more = True
  while more:
    posts_xml_string = requests.get(FEED + str(page))
    posts_xml = BeautifulSoup(posts_xml_string.text, features='lxml')
    posts = posts_xml.find_all('item')
    for post in posts:
      post_date = post.find('pubdate').contents
      print(post_date)

    if len(posts) == 0:
      more = False
    page = page + 1

run()
