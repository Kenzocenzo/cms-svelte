import sqlite3

# tworzenie bazy lub połączenie z istniejącą bazą
myConnection = sqlite3.connect('comms.sqlite')
myCursor = myConnection.cursor()
myCursor.execute("""CREATE TABLE IF NOT EXISTS [comms] (
[id] INT NULL,
[username] VARCHAR NULL,
[content] VARCHAR NULL,
[art_id] INT NULL
);""")
myConnection.commit()
myCursor.execute("""INSERT INTO comms VALUES
(1,'Vernon Roche','Nice artykuł',8);""")
myConnection.commit()
myConnection.close()