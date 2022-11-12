import os

from bottle import route, run, template, static_file, post, response, request
from utils import check_size_and_load_time, benchmark_with_assets

path = os.path.abspath(__file__)
dir_path = os.path.dirname(path)


@route('/static/<filename:path>')
def send_static(filename):
    return static_file(filename, root=f'{dir_path}/template/static/')


@post('/api/benchmark_site/')
def benchmark_site():
    try:
        json_response = {'status': True, 'site': request.json['site']}

        if request.json['include_assets']:
            json_response['size'], json_response[
                'time'] = benchmark_with_assets(request.json['site'])
        else:
            json_response['size'], json_response[
                'time'] = check_size_and_load_time(request.json['site'])

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
run(host='localhost', port=8000, server='paste')

# run(host='localhost', port=8000)
