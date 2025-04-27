from Actions import get_enum_value


class Menu:

    def main_menu(self):
        spaces = " " * 21
        sub_menu = (" " * 35)
        title = "Welcome to the Online Book Store"
        self.print_menu_header(title, sub_menu)
        print(f"{spaces}" "1. Member Login")
        print(f"{spaces}" "2. New Member Registration")
        print(f"{spaces}" "3. Quit")
        num_options = 3
        choice = self.validate_input(num_options)
        return get_enum_value("main_menu", choice)

    def print_menu_header(self, title, sub_menu):
        print("************************************************************")
        print("***                                                      ***")
        print("***            " + title + "          ***")
        print("***" + self.center_sub_menu_string(sub_menu, 54) + "***")
        print("************************************************************")

    def member_menu(self):
        spaces = " " * 21
        sub_menu = "Member Menu"
        title = "Welcome to the Online Book Store"
        self.print_menu_header(title, sub_menu)
        print(f"{spaces}" "1. Browse by Subject")
        print(f"{spaces}" "2. Search by Author/Title")
        print(f"{spaces}" "3. Check Out")
        print(f"{spaces}" "4. Logout")
        choice = self.validate_input(4)
        return get_enum_value("member_menu", choice)

    def search_menu(self):
        spaces = " " * 21
        sub_menu = "Search Menu"
        title = "Welcome to the Online Book Store"
        self.print_menu_header(title, sub_menu)
        print(f"{spaces}" "1. Author Search")
        print(f"{spaces}" "2. Title Search")
        print(f"{spaces}" "3. Go Back to Main Menu")
        choice = self.validate_input(3)
        return get_enum_value("search_menu", choice)

    def center_sub_menu_string(self, sub_menu, menu_length):
        if (len(sub_menu) % 2 != 0):
            sub_menu = sub_menu + " "

        spaces = " " * ((menu_length//2) - len(sub_menu)//2)
        sub_menu = spaces + sub_menu + spaces
        return sub_menu

    def validate_input(self, num_options):
        while True:
            choice = input("\nPlease enter your choice: ").strip()
            print("")
            if choice.isdigit():
                choice = int(choice)
                if 1 <= choice <= num_options:
                    return choice
                print(f"\nInvalid choice. Please enter a number between "
                      f"1 and, {num_options}\n")
