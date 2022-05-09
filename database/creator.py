import sqlite3

# tworzenie bazy lub połączenie z istniejącą bazą
myConnection = sqlite3.connect('additional_headers.sqlite')
myCursor = myConnection.cursor()
myCursor.execute("""CREATE TABLE IF NOT EXISTS [additional_headers] (
[id] INT NULL,
[name] VARCHAR NULL,
[href] VARCHAR NULL
);""")
myConnection.commit()
myCursor.execute("""INSERT INTO additional_headers VALUES
(0,'Wiedźmin wiki','https://witcher.fandom.com/wiki/Witcher_Wiki');""")
myConnection.commit()
myConnection.close()