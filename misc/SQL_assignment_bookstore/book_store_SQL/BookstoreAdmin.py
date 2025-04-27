from Database import Database
from BrowseAndSearch import BrowseAndSearch
from getpass import getpass
import datetime
from mysql.connector import connect, Error


class BookstoreAdmin:

    def addToCart(self, db: Database, isbn, qty, member):
        if qty < 1 or qty > 10:
            return False
        user_id = member[0]
        try:
            insert_query = f"""INSERT INTO cart (userid, isbn, qty)
                            VALUES ("{user_id}", "{isbn}", "{qty}"); """
            db.execute_with_commit(insert_query)
            return True
        except Exception as e:
            print(e)
            return False

    def deleteCart(self, db: Database, member):
        delete_query = f"""DELETE FROM cart
                    WHERE userid = {member[0]}"""
        try:
            db.execute_with_commit(delete_query)
            return True
        except Exception as e:
            print(e)
            return False

    def get_member(self, db: Database, email, password):
        members = self.get_all_members(db)
        for member in members:
            if member[8] == password and member[7] == email:
                return member

        return None

    def get_all_members(self, db: Database):
        query = """SELECT *
                    FROM members;"""
        members = db.execute_with_fetchall(query)
        return members

    def create_member(self, db: Database):
        fname = input("First name: ")
        lname = input("Last name: ")
        street_address = input("Enter street address: ")
        city = input("Enter city: ")
        state = input("State: ")
        zip_code = input("Enter zip: ")
        phone = input("Enter phone: ")
        email = input("Enter email: ")
        password = getpass("Enter password: ")

        try:
            insert_query = f""" INSERT INTO members (fname,lname,address,
                            city,zip,phone,email,password)
            VALUES("{fname}","{lname}","{street_address}",
            "{city + ", " + state}", "{zip_code}","{phone}",
            "{email}","{password}");   """
            db.execute_with_commit(insert_query)
            return True
        except Exception as e:
            print(e)
            return False

    def create_order(self, db: Database, member):
        current_date = datetime.date.today()
        sql_date = current_date.strftime('%Y-%m-%d')
        query = f""" INSERT INTO orders (userid, created, shipAddress,
                                        shipCity, shipZip)
                    VALUES('{member[0]}', '{sql_date}',
                    '{member[3]}', '{member[4]}', '{member[5]}'); """
        try:
            db.execute_with_commit(query)
            order_number_query = "SELECT LAST_INSERT_ID();"
            order_number = db.execute_with_fetchall(order_number_query)
            return order_number[0][0]
        except Exception as e:
            print(e)
            return None

    def create_order_details(self, db: Database, bas: BrowseAndSearch, cart,
                             order_number):

        try:
            for item in cart:
                amount = item[2] * bas.get_book_isbn(db, item[1])[3]
                query = f""" INSERT INTO odetails (ono, isbn, qty,
                                                amount)
                            VALUES('{order_number}', '{item[1]}',
                            '{item[2]}', '{amount}'); """
                db.execute_with_commit(query)
            return True
        except Exception as e:
            print(e)
            return False

    def database_login(self, username, password):
        try:
            connect(host="localhost", user=username, password=password,
                    database="book_store")
            return True
        except Error as e:
            print(f"An error occurred: {e}")
            return False
