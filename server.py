from flask import Flask, jsonify, redirect, send_from_directory, request
from flask_cors import CORS
import sqlite3
import json


app = Flask(__name__)
CORS(app)


# Path for our main Svelte page
@app.route("/")
def base():
    return send_from_directory('client/public', 'index.html')


# Path for all the static files (compiled JS/CSS, etc.)
paths = ["global.css", "global.css.map", "build/bundle.css", "build/bundle.js", "build/bundle.js.map"]


@app.route("/<path:path>")
def home(path):
    if path in paths:
        return send_from_directory('client/public', path)
    return send_from_directory('client/public', 'index.html')


@app.route("/getSettings")
def getSettings():
    f = open('./database/settings.json')
    mainSettings = json.load(f)
    f.close()

    myConnection = sqlite3.connect('./database/setter.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT * FROM setter")
    set = [dict(row) for row in myCursor.fetchall()]
    myConnection.close()
    setter = set[0]["setter"]
    print(setter)

    settings = mainSettings[setter].copy()

    settings["setter"] = setter

    myConnection = sqlite3.connect('./database/main_headers.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT * FROM main_headers")
    main_headers = [dict(row) for row in myCursor.fetchall()]
    myConnection = sqlite3.connect('./database/additional_headers.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT * FROM additional_headers")
    additional_headers = [dict(row) for row in myCursor.fetchall()]
    headers = {
        "main_headers": main_headers,
        "additional_headers": additional_headers}
    settings["headers"] = headers

    myConnection = sqlite3.connect('./database/main_footers.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT * FROM main_footers")
    main_footers = [dict(row) for row in myCursor.fetchall()]
    myConnection.close()
    myConnection = sqlite3.connect('./database/social_media_footers.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT * FROM social_media_footers")
    social_media_footers = [dict(row) for row in myCursor.fetchall()]
    myConnection.close()
    myConnection = sqlite3.connect('./database/footer.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT * FROM footer")
    foot = [dict(row) for row in myCursor.fetchall()]
    footer = foot[0]
    myConnection.close()
    footer["main_footers"] = main_footers
    footer["social_media_footers"] = social_media_footers
    settings["footer"] = footer

    myConnection = sqlite3.connect('./database/slider.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT * FROM slider")
    slider = [dict(row) for row in myCursor.fetchall()]
    myConnection.close()
    settings["slider"] = slider

    myConnection = sqlite3.connect('./database/articles.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT * FROM articles")
    articles = [dict(row) for row in myCursor.fetchall()]
    myConnection.close()
    settings["articles"] = articles

    myConnection = sqlite3.connect('./database/gallery.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT * FROM gallery")
    gallery = [dict(row) for row in myCursor.fetchall()]
    myConnection.close()
    settings["gallery"] = gallery

    myConnection = sqlite3.connect('./database/comments.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT * FROM comments")
    comments = [dict(row) for row in myCursor.fetchall()]
    settings["comments"] = comments
    myConnection.close()

    myConnection = sqlite3.connect('./database/comms.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT * FROM comms")
    comments = [dict(row) for row in myCursor.fetchall()]
    settings["comms"] = comments
    myConnection.close()

    return jsonify(settings)


@app.route("/getAllSettings")
def getAllSettings():
    f = open('./database/settings.json')
    mainSettings = json.load(f)
    f.close()
    myConnection = sqlite3.connect('./database/setter.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT * FROM setter")
    set = [dict(row) for row in myCursor.fetchall()]
    myConnection.close()
    select = set[0]["setter"]
    return jsonify({"settings": mainSettings, "select": select})


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    login = data["login"]
    password = data["password"]
    print(login + password)
    myConnection = sqlite3.connect('./database/users.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT *, oid FROM users")
    users = [dict(row) for row in myCursor.fetchall()]
    print(users)
    for el in users:
        print(el)
        if (el["login"] == login):
            if (el["password"] == password):
                isAdmin = el["isAdmin"]

                if (isAdmin == '1'):
                    return {"x": 1, "y": el["rowid"]}
                else:
                    return {"x": 2, "y": el["rowid"]}
            else:
                return {"x": 0}
    myConnection.close()
    return {"x": 0}


@app.route('/register', methods=['POST'])
def register_account():
    data = request.get_json()
    login = data["login"]
    password = data["password"]
    passwordr = data["passwordr"]
    print(login + password + passwordr)
    if (password != passwordr):
        return {"x": 0}
    myConnection = sqlite3.connect('./database/users.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT *, oid FROM users")

    users = [dict(row) for row in myCursor.fetchall()]
    for el in users:
        if (el["login"] == login):
            return {"x": 1}

    myCursor.execute("INSERT INTO users VALUES (:login, :password, :isAdmin)",
                     {
                         'login': login,
                         'password': password,
                         'isAdmin': '0'
                     })

    myConnection.commit()

    myConnection.close()
    print(users)

    return {"x": 2}


@app.route('/changeUser', methods=['POST'])
def changeUsername():
    data = request.get_json()
    login = data["login"]
    password = data["password"]
    id = data["id"]
    print(login + password + " " + str(id))
    oldLogin = ""
    myConnection = sqlite3.connect('./database/users.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT *, oid FROM users")
    users = [dict(row) for row in myCursor.fetchall()]
    for el in users:
        if (el["login"] == login and int(el["rowid"]) != int(id)):
            return {"x": 1}
        if (int(el["rowid"]) == int(id)):
            oldLogin = el["login"]
    myCursor.execute("UPDATE users SET login = '" + login + "', password = '" + password + "' WHERE oid = " + id)
    myConnection.commit()
    print(users)
    myConnection.close()
    myConnection = sqlite3.connect('./database/comments.sqlite')
    myCursor = myConnection.cursor()
    myCursor.execute("UPDATE comments SET username = '" + login + "' WHERE username = '" + oldLogin + "'")
    myConnection.commit()
    myConnection.close()
    print("UPDATE comments SET username = '" + login + "' WHERE username = '" + oldLogin + "'")
    return {"x": 2}


@app.route('/getArticles')
def getArticles():
    myConnection = sqlite3.connect('./database/articles.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT * FROM articles")
    articles = [dict(row) for row in myCursor.fetchall()]
    myConnection.close()
    return jsonify(articles)


@app.route('/getUsers')
def getUsers():
    myConnection = sqlite3.connect('./database/users.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT *, oid FROM users")
    users = [dict(row) for row in myCursor.fetchall()]
    myConnection.close()
    return jsonify(users)


@app.route('/deleteUser', methods=['POST'])
def deleteUser():
    data = request.get_json()
    id = data["id"]
    myConnection = sqlite3.connect('./database/users.sqlite')
    print(id)
    myCursor = myConnection.cursor()
    myCursor.execute("DELETE FROM users where oid = " + id)
    myConnection.commit()
    myConnection.close()


@app.route('/addComment', methods=['POST'])
def addComment():
    data = request.get_json()
    comment = data["comment"]
    print(comment)
    myConnection = sqlite3.connect('./database/comments.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()

    myCursor.execute("INSERT INTO comments VALUES (:id, :username, :content)", comment)

    myConnection.commit()

    myConnection.close()

    return {"x": 1}


@app.route('/deleteComment', methods=['POST'])
def deleteComment():
    data = request.get_json()
    id = data["id"]
    myConnection = sqlite3.connect('./database/comments.sqlite')
    print(id)
    myCursor = myConnection.cursor()
    myCursor.execute("DELETE FROM comments where id = " + id)
    myConnection.commit()
    myConnection.close()

@app.route('/addComm', methods=['POST'])
def addComm():
    data = request.get_json()
    comment = data["comment"]
    print(comment)
    myConnection = sqlite3.connect('./database/comms.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()

    myCursor.execute("INSERT INTO comms VALUES (:id, :username, :content, :art_id)", comment)

    myConnection.commit()

    myConnection.close()

    return {"x": 1}


@app.route('/deleteComm', methods=['POST'])
def deleteComm():
    data = request.get_json()
    id = data["id"]
    myConnection = sqlite3.connect('./database/comms.sqlite')
    print(id)
    myCursor = myConnection.cursor()
    myCursor.execute("DELETE FROM comms where id = " + id)
    myConnection.commit()
    myConnection.close()


@app.route('/saveSettings', methods=['POST'])
def saveSettings():
    myConnection = sqlite3.connect('./database/setter.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute("SELECT * FROM setter")
    set = [dict(row) for row in myCursor.fetchall()]
    myConnection.close()
    setter = set[0]["setter"]
    print(setter)

    data = request.get_json()
    mainSettings = data['setting']

    print(mainSettings)

    with open('./database/settings.json', 'w') as outfile:
        outfile.write(mainSettings)
        outfile.close()

    return 0


@app.route('/changeSelect', methods=['POST'])
def changeSelect():
    data = request.get_json()
    setter = data['select']

    print('lol')
    print(setter)

    myConnection = sqlite3.connect('./database/setter.sqlite')
    myConnection.row_factory = sqlite3.Row
    myCursor = myConnection.cursor()
    myCursor.execute(f"UPDATE setter SET setter = {setter} WHERE oid=1")
    myConnection.commit()
    myConnection.close()


@app.route('/addSlide', methods=['POST'])
def addSlide():
    data = request.get_json()
    slide = data
    print(data)
    myConnection = sqlite3.connect('./database/slider.sqlite')
    print(id)
    myCursor = myConnection.cursor()
    myCursor.execute("INSERT INTO slider VALUES (:id, :src, :name)", slide)
    myConnection.commit()
    myConnection.close()
    return jsonify(True)


@app.route('/changeSlide', methods=['POST'])
def changeSlide():
    data = request.get_json()
    id = data["id"]
    src = data["src"]
    name = data["name"]
    myConnection = sqlite3.connect('./database/slider.sqlite')
    print(id)
    myCursor = myConnection.cursor()
    myCursor.execute("UPDATE slider SET src = '" + src + "', name = '" + name + "' where id = " + id)
    myConnection.commit()
    myConnection.close()
    return jsonify(True)


@app.route('/deleteSlide', methods=['POST'])
def deleteSlide():
    data = request.get_json()
    id = data["id"]
    myConnection = sqlite3.connect('./database/slider.sqlite')
    print(id)
    myCursor = myConnection.cursor()
    myCursor.execute("DELETE FROM slider where id = " + id)
    myConnection.commit()
    myConnection.close()
    return jsonify(True)


@app.route('/addGallery', methods=['POST'])
def addGallery():
    data = request.get_json()
    gallery = data
    print(data)
    myConnection = sqlite3.connect('./database/gallery.sqlite')
    print(id)
    myCursor = myConnection.cursor()
    myCursor.execute("INSERT INTO gallery VALUES (:id, :title, :src)", gallery)
    myConnection.commit()
    myConnection.close()
    return jsonify(True)


@app.route('/changeGallery', methods=['POST'])
def changeGallery():
    data = request.get_json()
    id = data["id"]
    src = data["src"]
    title = data["title"]
    myConnection = sqlite3.connect('./database/gallery.sqlite')
    print(id)
    myCursor = myConnection.cursor()
    myCursor.execute("UPDATE gallery SET src = '" + src + "', title = '" + title + "' where id = " + id)
    myConnection.commit()
    myConnection.close()
    return jsonify(True)


@app.route('/deleteGallery', methods=['POST'])
def deleteGallery():
    data = request.get_json()
    id = data["id"]
    myConnection = sqlite3.connect('./database/gallery.sqlite')
    print(id)
    myCursor = myConnection.cursor()
    myCursor.execute("DELETE FROM gallery where id = " + id)
    myConnection.commit()
    myConnection.close()
    return jsonify(True)


@app.route('/changeMainFooter', methods=['POST'])
def changeMainFooter():
    data = request.get_json()
    id = data["id"]
    name = data["name"]
    myConnection = sqlite3.connect('./database/main_footers.sqlite')
    print(id)
    print(name)
    myCursor = myConnection.cursor()
    print("UPDATE main_footers SET name = '" + name + "' where id = " + str(id))
    myCursor.execute("UPDATE main_footers SET name = '" + name + "' where id = " + str(id))
    myConnection.commit()
    myConnection.close()
    return jsonify(True)


@app.route('/showMainFooter', methods=['POST'])
def showMainFooter():
    data = request.get_json()
    id = data["id"]
    show = data["show"]
    print(show)
    myConnection = sqlite3.connect('./database/main_footers.sqlite')
    print(id)
    myCursor = myConnection.cursor()

    myCursor.execute("UPDATE main_footers SET show = '" + str(show) + "' where id = " + str(id))

    myConnection.commit()
    myConnection.close()
    return jsonify(True)


@app.route('/changeSocialFooter', methods=['POST'])
def changeSocialFooter():
    data = request.get_json()
    id = data["id"]
    href = data["href"]
    myConnection = sqlite3.connect('./database/social_media_footers.sqlite')
    print("seima")
    print(href)
    print(id)
    myCursor = myConnection.cursor()
    print("UPDATE social_media_footers SET href = '" + href + "' where id = " + str(id))
    myCursor.execute("UPDATE social_media_footers SET href = '" + href + "' where id = " + str(id))
    myConnection.commit()
    myConnection.close()
    return jsonify(True)


@app.route('/showSocialFooter', methods=['POST'])
def showSocialFooter():
    data = request.get_json()
    id = data["id"]
    show = data["show"]
    print(show)
    myConnection = sqlite3.connect('./database/social_media_footers.sqlite')
    print(id)
    myCursor = myConnection.cursor()

    myCursor.execute("UPDATE social_media_footers SET show = '" + str(show) + "' where id = " + str(id))

    myConnection.commit()
    myConnection.close()
    return jsonify(True)


@app.route('/changeFooter', methods=['POST'])
def changeFooter():
    data = request.get_json()
    myConnection = sqlite3.connect('./database/footer.sqlite')
    print("seima")
    myCursor = myConnection.cursor()
    myCursor.execute("UPDATE footer SET contact_footer = '" + data["contact_footer"] + "', copyright = '" + data[
        "copyright"] + "' where 1=1")
    myConnection.commit()
    myConnection.close()
    return jsonify(True)


@app.route('/addHeader', methods=['POST'])
def addHeader():
    data = request.get_json()
    header = data
    print(data)
    myConnection = sqlite3.connect('./database/additional_headers.sqlite')
    print(id)
    myCursor = myConnection.cursor()
    myCursor.execute("INSERT INTO additional_headers VALUES (:id, :name, :href)", header)
    myConnection.commit()
    myConnection.close()
    return jsonify(True)


@app.route('/changeHeader', methods=['POST'])
def changeHeader():
    data = request.get_json()
    id = data["id"]
    href = data["href"]
    name = data["name"]
    myConnection = sqlite3.connect('./database/additional_headers.sqlite')
    print(id)
    myCursor = myConnection.cursor()
    myCursor.execute("UPDATE additional_headers SET href = '" + href + "', name = '" + name + "' where id = " + id)
    myConnection.commit()
    myConnection.close()
    return jsonify(True)


@app.route('/deleteHeader', methods=['POST'])
def deleteHeader():
    data = request.get_json()
    id = data["id"]
    myConnection = sqlite3.connect('./database/additional_headers.sqlite')
    print(id)
    myCursor = myConnection.cursor()
    myCursor.execute("DELETE FROM additional_headers where id = " + id)
    myConnection.commit()
    myConnection.close()
    return jsonify(True)


@app.route('/changeMainHeader', methods=['POST'])
def changeMainHeader():
    data = request.get_json()
    id = data["id"]
    name = data["name"]
    myConnection = sqlite3.connect('./database/main_headers.sqlite')
    print(id)
    print(name)
    myCursor = myConnection.cursor()
    print("UPDATE main_headers SET name = '" + name + "' where id = " + str(id))
    myCursor.execute("UPDATE main_headers SET name = '" + name + "' where id = " + str(id))
    myConnection.commit()
    myConnection.close()
    return jsonify(True)


@app.route('/showMainHeader', methods=['POST'])
def showMainHeader():
    data = request.get_json()
    id = data["id"]
    show = data["show"]
    print(show)
    myConnection = sqlite3.connect('./database/main_headers.sqlite')
    print(id)
    myCursor = myConnection.cursor()

    myCursor.execute("UPDATE main_headers SET show = '" + str(show) + "' where id = " + str(id))

    myConnection.commit()
    myConnection.close()
    return jsonify(True)


@app.route('/addArticle', methods=['POST'])
def addArticle():
    data = request.get_json()
    article = data
    print(data)
    myConnection = sqlite3.connect('./database/articles.sqlite')
    print(id)
    myCursor = myConnection.cursor()
    myCursor.execute("INSERT INTO articles VALUES (:id, :title, :img, :intro, :content, :date, :category)", article)
    myConnection.commit()
    myConnection.close()
    return jsonify(True)


@app.route('/changeArticle', methods=['POST'])
def changeArticle():
    data = request.get_json()
    print(data)
    id = data["id"]
    img = data["img"]
    title = data["title"]
    intro = data["intro"]
    date = data["date"]
    category = data["category"]
    content = data["content"]
    myConnection = sqlite3.connect('./database/articles.sqlite')
    print(id)
    myCursor = myConnection.cursor()
    myCursor.execute(
        "UPDATE articles SET img = '" + img + "', title = '" + title + "', intro='" + intro + "', date='" + date + "', category='" + category + "', content = '" + content + "'   where id = " + id)
    myConnection.commit()
    myConnection.close()
    return jsonify(True)


@app.route('/deleteArticle', methods=['POST'])
def deleteArticle():
    data = request.get_json()
    id = data["id"]
    myConnection = sqlite3.connect('./database/articles.sqlite')
    print(id)
    myCursor = myConnection.cursor()
    myCursor.execute("DELETE FROM articles where id = " + id)
    myConnection.commit()
    myConnection.close()
    return jsonify(True)


@app.errorhandler(404)
def pageNotFound(error):
    return redirect("/")


if __name__ == "__main__":
    app.run(debug=True)