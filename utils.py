import requests
from time import time
from bs4 import BeautifulSoup as bs
from urllib.parse import urljoin


def check_size_and_load_time(url):
    # as some content can be loaded in the base html
    if 'http' not in url:
        return (0, 0)
    start = time()
    site = requests.get(url)
    size = len(site.content)
    return (round(size * 0.008, 3), round(time() - start, 3))


def benchmark_with_assets(site):
    session = requests.Session()
    html = session.get(site).content
    soup = bs(html, "html.parser")
    assets_url = []
    for script in soup.find_all("script"):
        if script.attrs.get("src"):
            script_url = urljoin(site, script.attrs.get("src"))
            assets_url.append(script_url)
    for css in soup.find_all("link"):
        if css.attrs.get("href"):
            css_url = urljoin(site, css.attrs.get("href"))
            assets_url.append(css_url)
    image_urls = [img['src'] for img in soup.find_all('img')]
    assets_url = assets_url + image_urls
    size = 0
    load_time = 0
    assets_url.append(site)
    for url in assets_url:
        asset_size, asset_load_time = check_size_and_load_time(url)
        size = size + asset_size
        load_time = load_time + asset_load_time
    return (round(size, 3), round(load_time, 3))
