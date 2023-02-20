import DBManager from "~/utils/DBManager";

export interface QueryData {
    columns?: string[];
    where?: any;
}

export class DatabaseOperations {

    static async findOne<T>(table: string, data: QueryData): Promise<T|null> {
        const res = await this.find<T>(table, data);
        if (res.length > 0) {
            return res[0];
        }
        return null;
    }

    static find = async <Type>(table: string, data: QueryData = {}): Promise<Type[]> => {
        const query = this.QueryBuilder.build.filter(table, data);
        return new Promise((resolve, reject) => {
            DBManager.db?.query(query).then((result) => {
                if (result.values) {
                    let res: Type[] = [];
                    result.values.forEach((value) => {
                        res.push(value as Type);
                    });
                    resolve(res);
                }
                resolve([]);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static baseSave = async (table: string, data: any): Promise<boolean> => {
        console.log("trying to save: %o", data);
        const query = this.QueryBuilder.build.save(table, data);
        return new Promise((resolve, reject) => {
            DBManager.db?.query(query, Object.values(data)).then((result) => {
                resolve(true);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static baseUpdate = async (table: string, data: any, where?: any): Promise<boolean> => {
        const query = this.QueryBuilder.build.update(table, data, where);
        return new Promise((resolve, reject) => {
            DBManager.db?.query(query, Object.values(data)).then((result) => {
                resolve(true);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static baseReplace = async (table: string, data: any): Promise<boolean> => {
        const query = this.QueryBuilder.build.replace(table, data);
        return new Promise((resolve, reject) => {
            DBManager.db?.query(query, Object.values(data)).then((result) => {
                resolve(true);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static removeEntity = async (table: string, where: any): Promise<boolean> => {
        const query = this.QueryBuilder.build.remove(table, where);
        return new Promise((resolve, reject) => {
            DBManager.db?.query(query).then((result) => {
                resolve(true);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static async include<Type>(options: any, data: any) {
        const db = this
        const response = await db.find<Type>(data)

        // return if no record
        if(!response.length) return []

        const promisers = options.map(function (option: any) {
            return db.includeBuilder(response, option)
        })

        const outputs = await Promise.all(promisers)
        const newResponse: Type[] = []
        for (let i = 0; i < response.length; i++) {
            const item: any = response[i];
            const join: any = {}
            for (let j = 0; j < outputs.length; j++) {
                const output = outputs[j];
                const option = options[j];
                join[option.table] = output[i].rows
            }
            newResponse.push({ ...item, ...join })
        }
        return newResponse
    }

    static async includeBuilder(input: any, option: any) {
        const { table, pivot, pk, fk, fk_pivot, key, select = [] } = option
        const promiser = []
        for (let i = 0; i < input.length; i++) {
            const item = input[i];
            const query = this.QueryBuilder.build.innerJoin(table, pivot, pk, fk, fk_pivot, item[key], select)
            promiser.push(DBManager.db?.query(query))
        }
        return Promise.all(promiser)
    }

    static QueryBuilder = {
        build: {
            save: (name: string, data: any) => {
                if (name == undefined)
                    throw new Error("Table name is undefined");
                const vIterator = Object.keys(data).map((i, idx) => `$${idx + 1}` ).join(', ');
                const keys = Object.keys(data).join(', ');
                return `INSERT INTO ${name} (${keys}) VALUES (${vIterator})`;
            },

            update: (name: string, data: any, where?: any) => {
                if (name == undefined)
                    throw new Error("Table name is undefined");

                let query = `UPDATE ${name} SET `;

                const keys = Object.keys(data);
                keys.forEach((key, index) => {
                    query += `${key} = $${index + 1}`;
                    if (index < keys.length - 1) {
                        query += ', ';
                    }
                });

                if (!where) return query;

                query += ' WHERE ';
                const conditionKeys = Object.keys(where);
                const conditionValues = Object.values(where).map((value) => (typeof value === 'string' ? `'${value}'` : value));
                conditionKeys.forEach((key, index) => {
                    query += `${key} = ${conditionValues[index]}`;
                    if (index < conditionKeys.length - 1) {
                        query += ' AND ';
                    }
                });
                return query;
            },

            filter: (name: string, { columns, where }: QueryData) => {
                if (name == undefined)
                    throw new Error("Table name is undefined");

                let condition = '';

                if (where) {

                    const conditionKeys = Object.keys(where);
                    const conditionValues = Object.values(where).map((value) => (typeof value === 'string' ? `'${value}'` : value));
                    conditionKeys.forEach((key, index) => {
                        condition += `${key} = ${conditionValues[index]}`;
                        if (index < conditionKeys.length - 1) {
                            condition += ' AND ';
                        }
                    });
                }

                let query = `SELECT ${columns ? columns.join(', ') : '*'} FROM ${name}`;
                if (condition) query += ` WHERE ${condition}`;
                return query;

            },

            innerJoin: (name: string, pivot: string, pk: string, fk: string, fk_pivot: string, id: string, select = []) => {
                const selection = select.length ? select.map(s => `s.${s}`).join(',') : '*'

                return `SELECT ${selection} FROM ${pivot} sc INNER JOIN ${name} s ON s.${fk} = sc.${fk_pivot} WHERE sc.${pk} = ${id}`
            },

            replace: (name: string, data: any) => {
                if (name == undefined)
                    throw new Error("Table name is undefined");
                const vIterator = Object.keys(data).map((i, idx) => `$${idx + 1}` ).join(', ');
                const keys = Object.keys(data).join(', ');
                return `REPLACE INTO ${name} (${keys}) VALUES (${vIterator})`;
            },

            remove: (name: string, where: any) => {
                if (name == undefined)
                    throw new Error("Table name is undefined");

                let query = `DELETE FROM ${name} WHERE `;
                const conditionKeys = Object.keys(where);
                const conditionValues = Object.values(where).map((value) => (typeof value === 'string' ? `'${value}'` : value));
                conditionKeys.forEach((key, index) => {
                    query += `${key} = ${conditionValues[index]}`;
                    if (index < conditionKeys.length - 1) {
                        query += ' AND ';
                    }
                });
                return query;
            }
        }
    }
}