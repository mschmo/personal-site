#!/usr/bin/env python
import re
from time import sleep
import requests
from BeautifulSoup import BeautifulSoup
from pprint import pprint


AZ_BASE_URL = 'http://www.azlyrics.com'
KANYE_LYRICS_URL = 'http://www.azlyrics.com/w/west.html'

def get_yeezy():
    soup = BeautifulSoup(requests.get(KANYE_LYRICS_URL).text)
    albums = soup.find('div', {'id': 'listAlbum'})
    [s.extract() for s in albums(['script', 'br', 'span'])]
    albums = [row for row in albums if row != '\n']

    # This method actually works great since it ignores the last album
    # which is 'other songs' and I don't want that included
    breaks = [i for i, row in enumerate(albums) if row.get('class') == 'album']
    albums = [albums[album_break:breaks[i+1]]
        for i, album_break in enumerate(breaks)
        if i < len(breaks) - 1]

    return format_albums(albums)

def format_albums(albums):
    formatted_albums = {}
    for album in albums:
        title = album[0].text
        album_title = re.search('\"(.*?)\"', title).group(1)
        formatted_albums[album_title] = {
            'year': re.search('\((.*?)\)', title).group(1),
            'track_count': len(album) - 1,
            'tracks': {track.text: get_lyrics(track.get('href')) for track in album[1:]}
        }

    return formatted_albums

def get_lyrics(relative_url):
    try:
        soup = BeautifulSoup(requests.get(relative_url.replace('..', AZ_BASE_URL)).text)
        sleep(10)
        return  soup.find('div', {'style': 'margin-left:10px;margin-right:10px;'}).text
    except:
        return ''

def write_lyrics_to_files(yeezy):
    pass

if __name__ == '__main__':
    pprint(get_yeezy())