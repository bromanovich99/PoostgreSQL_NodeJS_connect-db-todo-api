import db from '../db.js';


class TodoController {
    async getTasksForToday(req, res) {
        const [today, lists] = await Promise.all([
            db.query(`SELECT count(*) AS tasks
                      FROM todo
                      WHERE DATE(due_date) BETWEEN current_date AND current_date`),
            db.query(`SELECT lists.title, count(*) AS tasks
                      FROM lists
                               LEFT JOIN todo ON lists.id = todo.list_id
                      GROUP BY lists.id;`)
        ])
        const a = [today.rows, lists.rows]
        if (a.length !== 0) {
            const result = {
                today: today.rows,
                'Lists and open tasks': lists.rows
            }
            res.status(200);
            res.json(result);
        } else {
            res.status(404);
            res.end('Not Found');
        }
    }

    async getAllOpenTaskById(req, res) {
        const listId = parseInt(req.params.listId)
        if (!(req.query.all !== true)) {
            const result = await db.query('SELECT * FROM todo WHERE listId=$1', [listId])
            results = result.rows;
        }
        const result = await db.query(`SELECT *
                                       FROM todo
                                       WHERE done = false
                                         AND listId = $1`, [listId])
        const a = result.rows
        if (a.length !== 0) {
            res.status(200);
            res.json(result.rows);
        } else {
            res.status(404);
            res.end('Not Found');
        }
    }


    async getCollectionOfTaskForToday(req, res) {
        const collection = await db.query(`SELECT todo.id     AS todoid,
                                                  todo.title  AS taskname,
                                                  lists.id    AS listid,
                                                  lists.title AS listname
                                           FROM todo
                                                    RIGHT JOIN lists ON todo.list_id = lists.id
                                           where todo.due_date = $1`, [new Date()]
        )
        const a = collection.rows
        if (a.length !== 0) {
            const result = {
                'collection for today': collection.rows
            }
            res.status(200);
            res.json(result);
        } else {
            res.status(404);
            res.end('Not Found');
        }
    }

    async createTask(req, res) {
        const {id, title, done, due_date} = req.body
        const result = await db.query(`INSERT INTO todo(id, title, done, due_date)
                                       VALUES ($1, $2, $3, $4)
                                       RETURNING * `, [id, title, done, due_date]);
        const a = result.rows
        if (a.length !== 0) {
            res.status(200);
            res.json(result.rows);
        } else {
            res.status(404);
            res.end('Not Found');
        }
    }

    async getTasks(req, res) {
        const result = await db.query(`SELECT *
                                       FROM todo`)
        if (result.rows.length !== 0) {
            res.status(200);
            res.json(result.rows);
        } else {
            res.status(404);
            res.end('Not Found');
        }
    }

    async getTask(req, res) {
        const id = req.params.id
        const result = await db.query(`SELECT *
                                       FROM todo
                                       where id = $1`, [id])
        if (result.rows.length !== 0) {
            res.status(200);
            res.json(result.rows[0]);
        } else {
            res.status(404);
            res.end('Not Found');
        }
    }

    async updateTask(req, res) {
        const {id, title, done, due_date} = req.body
        const result = await db.query(`UPDATE todo
                                       SET title    = $2,
                                           done     = $3,
                                           due_date = $4
                                       where id = $1
                                       RETURNING * `,
            [id, title, done, due_date])
        const a = result.rows
        if (a.length !== 0) {
            res.status(200);
            res.json(result.rows[0]);
        } else {
            res.status(404);
            res.end('Not Found');
        }
    }

    async deleteTask(req, res) {
        const id = req.params.id
        const result = await db.query(`DELETE
                                       FROM todo
                                       where id = $1`, [id])
        res.status(204);
        res.json(result.rows[0])
    }
}

export const todoController = new TodoController()
