# PoostgreSQL_NodeJS_connect-db-todo-api
connect BD: Done
-------------------------------------------------------------------------------

    /dashboard
    
        Ответ должен содержать обзорную информацию по задачам:
        
       - Количество задач запланированных на сегодня. Использовать SQL BETWEEN по dueDate, и COUNT.
       
       - Все списки и количество не выполненных задач в каждом. Для подсчета количества задач использовать GROUP BY и COUNT в SQL.
       
        Информацию про список получить в том-же запросе используя RIGHT JOIN (ответ также должен содержать списки без задач).
        router.get('/dashboard',(req, res) => {
    todoController.getDashboard(req,res)
})
     ---------------------------------------------------------------------------------------   
    /collection/today
    
       -Ответ содержит список задач назначенных на текущий день.
       
       Для каждой задачи включена информация про название списка, в котором она находиться.
       
       Для этого использовать eager loading связи к списку.
       ------------------------------------------------------------------------------------------------------------------------
     /lists/{listId}/tasks
     
       Работа с задачами конкретного списка. Вложенный ресурс. 
       
       Указать этот базовый путь над контроллером для задач. 
       
       Ответ содержит только открытые задачи.
       
       ?all=true - параметр запроса, включает в ответ также и выполненные задачи.
       
-------------------------------------------------------------------------------------------------------------------------