import mysql.connector

def fetch_user_profile(user_id):
    connection = mysql.connector.connect(
        host="your-database-host",
        user="your-database-user",
        password="your-database-password",
        database="your-database-name"
    )
    
    cursor = connection.cursor(dictionary=True)
    cursor.execute(f"SELECT * FROM user_profiles WHERE user_id = {user_id}")
    
    user_profile = cursor.fetchone()
    
    cursor.close()
    connection.close()
    
    return user_profile if user_profile else None

