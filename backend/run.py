# -*- coding: utf-8 -*-
import requests
from flask import Flask, jsonify
from flask import abort
from flask import request

app = Flask(__name__)


@app.route('/api/search')
def search():
    search_item = request.values.get('searchItem')
    url = "https://api.github.com/search/repositories?q=%s&sort=stars&order=desc&per_page=30" % search_item
    response = requests.get(url)
    if response.status_code == 200:
        json_data = response.json()
        repos = []
        for item in json_data['items']:
            repos.append({
                'name': item['owner']['login'] + '/' + item['name'],
                'description': item['description']
            })
        return jsonify({'results': repos})
    else:
        abort(400)


@app.route('/api/contributors/<owner>/<repo>')
def get_contributors(owner, repo):
    url = 'https://api.github.com/repos/' + owner + '/' + repo + '/contributors?per_page=100'
    contributors = []
    json_data = True
    i = 1
    while json_data:
        response = requests.get(url + "&page=%s" % i)
        if response.status_code == 200:
            json_data = response.json()
            contributors += [contributor['login'] for contributor in json_data]
            i += 1
        else:
            abort(400)
    return jsonify({"results": contributors})


@app.route('/api/last-commits/<owner>/<repo>')
def get_commits(owner, repo):
    url = 'https://api.github.com/repos/' + owner + '/' + repo + '/commits?per_page=100'
    response = requests.get(url)
    if response.status_code == 200:
        json_data = response.json()
        commits = []
        for commit in json_data:
            try:
                login = commit['author']['login']
            except TypeError:
                login = None  # user is not registered on github
            date = commit['commit']['author']['date']
            commits.append({
                'login': login,
                'date': date
            })
        return jsonify({"results": commits})
    else:
        abort(400)

if __name__ == '__main__':
    app.run(port=8000, debug=True)