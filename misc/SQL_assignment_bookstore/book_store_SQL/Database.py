from mysql.connector import connect, Error


class Database:

    # Establish connection to MySQL database
    def __init__(self, username, password) -> None:
        try:
            self.connection = connect(host="localhost", user="root",
                                      password=password, database="book_store")
        except Error as e:
            print("Error connecting to the database:", e)

    # Get cursor
    def __get_cursor__(self):
        return self.connection.cursor()

    # Execute and fetch all results
    def execute_with_fetchall(self, query):
        with self.__get_cursor__() as cursor:
            cursor.execute(query)
            return cursor.fetchall()

    # Execute with commit
    def execute_with_commit(self, query):
        with self.__get_cursor__() as cursor:
            cursor.execute(query)
            self.connection.commit()
