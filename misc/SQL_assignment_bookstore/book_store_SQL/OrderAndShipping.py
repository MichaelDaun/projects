from Database import Database
from BrowseAndSearch import BrowseAndSearch
from datetime import timedelta


class OrderAndShipping:

    def print_receipt(self, db: Database, bas: BrowseAndSearch, cart):
        # Print header
        print(f"ISBN{' ' * 10}TITLE{' ' * 40}${' ' * 5}Qty{' ' * 5}Total")
        print(f"{'_' * 85}")

        total_price = 0

        for items in cart:
            isbn = items[1]
            qty = items[2]
            book = bas.get_book_isbn(db, isbn)
            title = book[2]
            price = book[3]
            total_item_price = price * qty
            total_price += total_item_price

            # Print item details
            print(f"{isbn:<13} {title[:40].ljust(40):<22} {price:>8.2f} "
                  f"{qty:^6} {total_item_price:>7.2f}")

        # Print footer
        print(f"{'_' * 85}")
        print(f"Total{' ' * 65}${total_price:.2f}")
        print(f"{'_' * 85}")

    def get_order(self, db: Database, order_number):
        query = f"""SELECT *
                    FROM orders
                    WHERE '{order_number}' = ono;"""
        order = db.execute_with_fetchall(query)
        return order

    def get_cart(self, db: Database, member):
        query = f"""SELECT *
                FROM cart
                WHERE '{member[0]}' = cart.userid;"""
        cart = db.execute_with_fetchall(query)
        if not cart:
            return None
        else:
            return cart

    def get_order_details(self, db: Database, order_details_number):
        query = f"""SELECT *
                FROM odetails
                WHERE '{order_details_number}' = ono;"""
        order_details = db.execute_with_fetchall(query)
        return order_details

    def print_shipping_info(self, member, order):
        print(f"\n{' ' * 2}Invoice for Order no.{order[0][1]}\n")
        print(f"{' ' * 2}---Shipping Address---")
        print(f"Name:{' ' * 5}{member[1]} {member[2]}")
        print(f"Address:{' ' * 2}{order[0][3]}\n{' ' * 10}{order[0][4]}\n"
              f"{' ' * 10}{order[0][5]}\n")
        print(f"Expected delivery:{' ' * 1} "
              f"{self.calculate_delivery_date(order[0][2])}\n")
        return

    def calculate_delivery_date(self, date):
        delivery_date = date + timedelta(weeks=1)
        return delivery_date
