'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Anna Duong, 
Purpose:    Deploy to Azure Function for the process of automatically upload the points to QDrant
Date:       15/08/24
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''

import logging
import azure.functions as func
from create_vectordb import main

app = func.FunctionApp()

@app.schedule(schedule="0 0 */12 * * *", arg_name="myTimer", run_on_startup=True,
              use_monitor=False) 
def Rag_Timer_Trigger_Function(myTimer: func.TimerRequest) -> None:
    if myTimer.past_due:
        logging.info('The timer is past due!')

    logging.info('Python timer trigger function executed.')
    main()