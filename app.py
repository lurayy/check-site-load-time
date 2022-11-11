from time import time
from urllib.request import urlopen
from bottle import route, run, template, static_file, post, response, request


@route('/css/<filename:re:.*\.css>')
def send_css(filename):
    return static_file(filename, root='template/css')


@route('/js/<filename:re:.*\.js>')
def send_js(filename):
    return static_file(filename, root='template/js')


@post('/api/benchmark_site/')
def benchmark_site():
    try:
        start = time()
        site = urlopen(request.json['site'])
        site.read()
        site.close()
        json_response = {'status': True, 'time': round(time() - start, 3)}
        response.headers['Content-Type'] = 'application/json'
        return dict(data=json_response)
    # Can be improved
    except Exception as exp:
        return dict(data={
            'status': False,
            'msg': f'{exp.__class__.__name__}: {exp}'
        })


@route('/')
def index():
    return template('template/index.html')


# for multi-thread
run(host='localhost', port=8000, server='paste')

# run(host='localhost', port=8000)
