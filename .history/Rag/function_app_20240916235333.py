'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Authors:    Anna Duong, 
Purpose:    Implemented based on news_feed.py but with the help of API
Date:       15/09/24
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