import urllib3
from bs4 import BeautifulSoup, Comment
from elasticsearch import Elasticsearch

base_url = 'https://en.wikibooks.org'
elasticengine = Elasticsearch(['https://search-elasticengine-kbo7lvgosgrnzvlijimb2c4lk4.us-east-1.es.amazonaws.com'])
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

f = open('urls.txt')
temp = f.readlines()
urls = [url.split('\n')[0] for url in temp]
f.close()

elasticengine.indices.delete(index='aw-rec-engine', ignore=[400, 404])
elasticengine.indices.create(index='aw-rec-engine', ignore=400)

http = urllib3.PoolManager()
for url in urls:
    html = http.request('GET', url).data
    soup = BeautifulSoup(html, 'lxml')
    heading = soup.find(id='firstHeading').text
    content = soup.find('div', id='mw-content-text').div

    for element in content.find_all(class_={'noprint', 'mw-editsection', 'metadata', 'reference'}):
        element.decompose()
    for element in content.find_all(class_='wikitable', style='float: right;'):
        element.decompose()

    h2tags = content.find_all({'h2', 'h3', 'h4'})
    htmlData = ''
    for element in content:
        if element not in h2tags:
            if not isinstance(element, Comment):
                htmlData += element.encode('ascii')
        else:
            esData = {'title': heading, 'html': htmlData, 'url': url}
            elasticengine.index(index="aw-rec-engine", doc_type="docs", body=esData)
            heading = element.find(class_='mw-headline').text
            htmlData = ''
