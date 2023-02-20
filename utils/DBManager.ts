import {SQLiteDBConnection, useSQLite} from "vue-sqlite-hook";

export default class DBManager {
    static db: SQLiteDBConnection|null = null;
    static sqlite = useSQLite();

    static async init() {
        this.db = await this.sqlite.createConnection('data.db');
        await this.db.open();

        await this.db.executeTransaction([
            {statement: 'CREATE TABLE IF NOT EXISTS Setting (id TEXT PRIMARY KEY, value TEXT)'},
            {statement: 'CREATE TABLE IF NOT EXISTS Media (id INTEGER PRIMARY KEY, name TEXT, ext TEXT)'},
            {statement: 'CREATE TABLE IF NOT EXISTS DishCategory (id INTEGER PRIMARY KEY, parent_id INTEGER, locales TEXT, default_locale TEXT, picto INTEGER, display_order INTEGER)'},
            {statement: 'CREATE TABLE IF NOT EXISTS Menu (id INTEGER PRIMARY KEY, logo INTEGER, background INTEGER, child INTEGER, locales TEXT, default_locale TEXT, display_order INTEGER, highlight INTEGER)'},
            {statement: 'CREATE TABLE IF NOT EXISTS Dish (id INTEGER PRIMARY KEY, logo INTEGER, display_order INTEGER, locales TEXT, default_locale TEXT, category INTEGER, highlight INTEGER, price INTEGER, visibility INTEGER, active INTEGER, timeslot INTEGER)'},
        ]);
    }
}