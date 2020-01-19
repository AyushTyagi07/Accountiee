import sqlite3
import pandas as pd
import sys
 

conn = sqlite3.connect('datast.sqlite3')
print("Opened database successfully")

def insertperson(name,abbr,ptype,pending,contact,gstid):
    conn.execute("INSERT INTO Person (Name ,Abbr,Type,Pending,Contact,GSTID) VALUES ('"+str(name)+"','"+str(abbr)+"','"+str(ptype)+"',"+int(pending)+",'"+str(contact)+"','"+str(gstid)+"');")
    conn.commit()
def insertentry(Stype,Amount,Date,pid):
    conn.execute("INSERT INTO Transaction (Stype,Amount,Date) VALUES ('"+str(Stype)+"',"+int(Amount)+",'"+str(Date)+"', "+int(pid)+");")
    conn.commit()

def getallperson():
    df = pd.read_sql_query("SELECT * FROM  Person ;", conn)
    return df

def getalltransactions(pid):
    df = pd.read_sql_query("SELECT * FROM  Transactions where pid="+str(pid)+" ;", conn)
    return df

def getalloptions():
    df = pd.read_sql_query("SELECT pid FROM  Person ;", conn)
    return df

def getallpending():
    df = pd.read_sql_query("SELECT pending FROM  Person ;", conn)
    return df

def getpending(pid):
    df = pd.read_sql_query("SELECT pending FROM  Person where pid ="+str(pid)+" ;", conn)
    return df

def getentrycount():
    df = pd.read_sql_query("SELECT COUNT() FROM  Transactions ;", conn)
    return df

'''DATABASE Functions END'''