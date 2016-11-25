# -*- coding: utf-8 -*-
import requests
from flask import Flask, jsonify
from flask import abort
from flask import request

app = Flask(__name__)


@app.route('/search')
def search():
    search_item = request.values.get('searchItem')
    url = "https://api.github.com/search/repositories?q=%s&sort=stars&order=desc" % search_item
    response = requests.get(url)
    if response.status_code == 200:
        json_data = response.json()
        repos = []
        for item in json_data['items']:
            repos.append(item['owner']['login'] + '/' + item['name'])
        return jsonify({'results': repos})
    else:
        abort(400)


@app.route('/contributors/<owner>/<repo>')
def get_contributors(owner, repo):
    url = 'https://api.github.com/repos/' + owner + '/' + repo + '/contributors'
    response = requests.get(url)
    if response.status_code == 200:
        json_data = response.json()
        contributors = []
        for contributor in json_data:
            contributors.append(contributor['login'])
        return jsonify({"results": contributors})
    else:
        abort(400)


@app.route('/last-commits/<owner>/<repo>')
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