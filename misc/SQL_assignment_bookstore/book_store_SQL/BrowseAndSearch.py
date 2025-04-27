from Database import Database


class BrowseAndSearch:

    def get_subjects_with_key(self, db: Database):
        subjects_with_key = {}
        query = """ SELECT DISTINCT subject
                    FROM books
                    ORDER BY subject;
                """
        subjects = db.execute_with_fetchall(query)

        i = 0
        for subject in subjects:
            i += 1
            cleanSubject = subject[0]
            temp_dict = {cleanSubject: i}
            subjects_with_key.update(temp_dict)

        return subjects_with_key

    def choose_subject(self, choice, subjects_with_key):
        while True:
            try:
                choice = int(choice)  # Convert the input to an integer
                if 1 <= choice <= len(subjects_with_key):
                    for subject, number in subjects_with_key.items():
                        if choice == number:
                            return subject
                    print("\nInvalid input. Please choose a valid subject "
                          "number.\n")
                else:
                    print(f"\nInvalid input. Please enter a number between "
                          f"1 and {len(subjects_with_key)}.\n")
            except ValueError:
                print("Invalid input. Please enter a valid integer.")

            # Prompt the user to enter a new choice
            choice = input(f"\nChoose a subject (enter a number between 1 "
                           f"and {len(subjects_with_key)}\n): ")

    def get_books_from_subject(self, db: Database, subject):
        query = f"""SELECT *
                    FROM books b
                    WHERE b.subject = '{subject}'
                    ORDER BY title"""
        books_from_subject = db.execute_with_fetchall(query)
        print(f"\n{len(books_from_subject)} books available on this subject "
              f"({subject})\n")
        return books_from_subject

    def display_books(self, books, start_index, no_books_to_display):
        book_count = len(books)
        if book_count == 0:
            print("No books to display.")
            return
        for i in range(start_index, start_index + no_books_to_display):
            index = i % book_count  # Ensure looping back to the beginning
            if index < book_count:
                self.print_book_info(books[index])

    def print_book_info(self, book):
        print(f"Author: {book[1]}")
        print(f"Title: {book[2]}")
        print(f"ISBN: {book[0]}")
        print(f"Price: {book[3]}")
        print(f"Subject {book[4]}")
        print("\n")

    def isbn_match(self, isbn, books):
        for book in books:
            if isbn == book[0]:
                return True

        return False

    def get_all_books(self, db: Database):
        query = """SELECT *
                FROM books;"""
        all_books = db.execute_with_fetchall(query)
        return all_books

    def search_by_author(self, db: Database):
        author = input("Enter authors name or part of authors name: ")
        query = f"""SELECT *
                FROM books
                WHERE author LIKE '%{author}%'"""
        search_result = db.execute_with_fetchall(query)
        print(f"\n{len(search_result)} books found ({author}).\n")
        return search_result

    def search_by_title(self, db: Database):
        title = input("Enter title or part of the title: ")
        query = f"""SELECT *
                FROM books
                WHERE title LIKE '%{title}%'"""
        search_result = db.execute_with_fetchall(query)
        print(f"\n{len(search_result)} books found ({title}).\n")
        return search_result

    def get_book_isbn(self, db: Database, isbn):
        books = self.get_all_books(db)
        for book in books:
            if isbn == book[0]:
                return book

        return None

    def display_subjects(self, db: Database):
        subject_with_key = self.get_subjects_with_key(db)
        for subject, number in subject_with_key.items():
            print(f"{number}. {subject}")
