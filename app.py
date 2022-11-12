import os
import requests
from time import time

from bottle import route, run, template, static_file, post, response, request

path = os.path.abspath(__file__)
dir_path = os.path.dirname(path)


@route('/static/<filename:path>')
def send_static(filename):
    print(filename)
    return static_file(filename, root=f'{dir_path}/template/static/')


@post('/api/benchmark_site/')
def benchmark_site():
    try:
        if request.json['use_browser_sim']:
            pass
        start = time()
        site = requests.get(request.json['site'])
        size = len(site.content)
        json_response = {
            'status': True,
            'time': round(time() - start, 3),
            'size': round(size * 0.008, 3),
            'site': request.json['site']
        }
        response.headers['Content-Type'] = 'application/json'
        return dict(data=json_response)
    # Can be improved
    except Exception as exp:
        return dict(
            data={
                'status': False,
                'msg': f'{exp.__class__.__name__}: {exp}',
                'site': request.json['site']
            })


@route('/')
def index():
    return template('template/index.html')


# for multi-thread
# run(host='localhost', port=8000, server='paste')

run(host='localhost', port=8000)
