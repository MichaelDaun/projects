from Database import Database
from getpass import getpass
from BrowseAndSearch import BrowseAndSearch
from BookstoreAdmin import BookstoreAdmin
from OrderAndShipping import OrderAndShipping
from Menu import Menu
from Actions import MainMenuActions, MemberMenuActions, SearchMenuActions
global logged_in_user


def main():
    bas = BrowseAndSearch()
    admin = BookstoreAdmin()
    oas = OrderAndShipping()
    menu = Menu()
    # Initiate start up sequence
    db = start_up(admin)
    # Start of user application
    start_menu(db, admin, menu, bas, oas)


def start_menu(db: Database, admin: BookstoreAdmin, menu: Menu,
               bas: BrowseAndSearch, oas: OrderAndShipping):
    while True:
        user_choice = menu.main_menu()
        if user_choice == MainMenuActions.MEMBER_LOGIN:
            if user_log_in(db, admin) is False:
                continue
            else:
                member_menu(db, admin, menu, bas, oas)
        elif user_choice == MainMenuActions.NEW_MEMBER_REGISTRATION:
            if admin.create_member(db) is False:
                print("Member creation failed.\n")
                continue
            else:
                print("\nMember Creation Successful!\n")
                continue
        elif user_choice == MainMenuActions.QUIT:
            print("Goodbye!")
            exit()


def member_menu(db: Database, admin: BookstoreAdmin, menu: Menu,
                bas: BrowseAndSearch, oas: OrderAndShipping):
    while True:
        user_choice = menu.member_menu()
        if user_choice == MemberMenuActions.BROWSE_BY_SUBJECT:
            bas.display_subjects(db)
            subjects = bas.get_subjects_with_key(db)
            print(f"\nChoose a subject: (Enter a number between "
                  f"1-{len(subjects)}):\n")
            choice = input("-> ")
            chosen_subject = bas.choose_subject(choice, subjects)
            books = bas.get_books_from_subject(db, chosen_subject)
            browse_books(bas, db, admin, books, logged_in_user, 2)
        elif user_choice == MemberMenuActions.SEARCH_BY_AUTHOR_TITLE:
            search_menu(db, bas, oas, admin, menu)
        elif user_choice == MemberMenuActions.CHECK_OUT:
            check_out(db, bas, admin, oas, menu, logged_in_user)
        elif user_choice == MemberMenuActions.LOGOUT:
            log_out()
            start_menu(db, admin, menu, bas, oas)


def check_out(db: Database, bas: BrowseAndSearch, admin: BookstoreAdmin,
              oas: OrderAndShipping, menu: Menu, logged_in_user):
    cart = oas.get_cart(db, logged_in_user)

    if cart is None:
        print("\nNo items in cart. Returning to Member Menu...\n")
        member_menu(db, admin, menu, bas, oas)

    oas.print_receipt(db, bas, cart)
    proceed_question = input("\nProceed to check out (Y/N ?): \n").lower()
    if proceed_question == "y" or proceed_question == "yes":
        order_number = admin.create_order(db, logged_in_user)
        order = oas.get_order(db, order_number)
        admin.create_order_details(db, bas, cart, order_number)
        oas.print_shipping_info(logged_in_user, order)
        oas.print_receipt(db, bas, cart)
        admin.deleteCart(db, logged_in_user)
        print("\nThanks For Shopping!\n")
        log_out()
        start_menu(db, admin, menu, bas, oas)
    elif proceed_question == "n":
        print("\nReturning to Member Menu\n")
        member_menu(db, admin, menu, bas, oas)
    else:
        print("\nInvalid input. Returning to Member Menu\n")
        member_menu(db, admin, menu, bas, oas)


def search_menu(db: Database, bas: BrowseAndSearch, oas: OrderAndShipping,
                admin: BookstoreAdmin, menu: Menu):
    while True:
        user_choice = menu.search_menu()
        if user_choice == SearchMenuActions.AUTHOR_SEARCH:
            search_result = bas.search_by_author(db)
            browse_books(bas, db, admin, search_result, logged_in_user, 3)
        elif user_choice == SearchMenuActions.TITLE_SEARCH:
            search_result = bas.search_by_title(db)
            browse_books(bas, db, admin, search_result, logged_in_user, 3)
        elif user_choice == SearchMenuActions.GO_TO_MAIN_MENU:
            member_menu(db, admin, menu, bas, oas)


def start_up(admin: BookstoreAdmin):
    print("\nEstablishing connection to database...\n")
    sql_username = input("Please provide SQL username: ")
    sql_password = getpass("Enter SQL server password: ")
    if not admin.database_login(sql_username, sql_password):
        print("Login attempt failed. Exiting application.")
        exit()
    db = Database(sql_username, sql_password)
    print("\n---Database Online---\n")
    return db


def log_out():
    global logged_in_user
    print(f"Logging out user {logged_in_user[7]}...\n")
    logged_in_user = None


def user_log_in(db: Database, admin: BookstoreAdmin):
    global logged_in_user
    username = input("Enter email: ")
    password = getpass("Enter password: ")
    log_in_attempt = admin.get_member(db, username, password)
    if log_in_attempt is not None:
        print(f"\nUser {username} logged in successfully\n")
        logged_in_user = log_in_attempt
        return True
    else:
        print(f"\nLog in attempt for user {username} failed.\n")
        return False


def browse_books(bas: BrowseAndSearch, db: Database,
                 admin: BookstoreAdmin, books, member, no_books_to_display):
    i = 0
    while True:
        bas.display_books(books, i, no_books_to_display)
        print("""Enter ISBN to add to Cart or
            n to browse or ENTER to go back to menu:""")
        user_input = input("-> ")
        if bas.isbn_match(user_input, books) is True:
            qty = input("\nEnter quantity (1-10): ")
            try:
                qty = int(qty)
                if not (1 <= qty <= 10):
                    print("Please enter a quantity between 1 and 10. \n")
            except ValueError:
                print("Invalid input. Please enter a valid integer. \n")
            cart_status = admin.addToCart(db, user_input, qty, member)
            if cart_status is True:
                print(f"\nAdded {qty} books to cart\n")
        elif user_input == "n":
            i += 1
        elif user_input == "":
            break


if __name__ == "__main__":
    main()
