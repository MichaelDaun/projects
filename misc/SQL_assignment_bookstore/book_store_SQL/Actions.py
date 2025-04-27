from enum import Enum


class MainMenuActions(Enum):
    MEMBER_LOGIN = 1
    NEW_MEMBER_REGISTRATION = 2
    QUIT = 3


class MemberMenuActions(Enum):
    BROWSE_BY_SUBJECT = 1
    SEARCH_BY_AUTHOR_TITLE = 2
    CHECK_OUT = 3
    LOGOUT = 4


class SearchMenuActions(Enum):
    AUTHOR_SEARCH = 1
    TITLE_SEARCH = 2
    GO_TO_MAIN_MENU = 3


def get_enum_value(menu_type, user_input):
    if menu_type == "main_menu":
        return MainMenuActions(int(user_input))
    elif menu_type == "member_menu":
        return MemberMenuActions(int(user_input))
    elif menu_type == "search_menu":
        return SearchMenuActions(int(user_input))
    else:
        raise ValueError("Invalid menu type")
