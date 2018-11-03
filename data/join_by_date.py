import json

with open(r"./all_data.json", "w+") as final_file:
    with open("./learningData.json", "r") as f:
        learning_data = json.load(f)
    with open("./pdata.json", "r") as f:
        p_data = json.load(f)
    with open("./tdata.json", "r") as f:
        t_data = json.load(f)
    with open("./seasonal_sales.json", "r") as f:
        sales_data = json.load(f)

    for item in learning_data:
        learning_date = item['DATE']
        learning_state = item['STATE']
        learning_category = item['CATEGORY']
        for p in p_data:
            p_date = p['date']
            p_state = p['state']
            for t in t_data:
                t_date = t['date']
                t_state = t['state']
                for sale in sales_data:
                    sale_date = sale['ORDERDATE']
                    sale_state = sale['STATE']
                    sale_category = sale['CATEGORY']
                    if(p_date == sale_date):
                        if(p_state == sale_state):
                            sale['precip'] = p['value']
                    if(t_date == sale_date):
                        if(t_state == sale_state):
                            sale['temp'] = t['value']
                    if(learning_date == sale_date):
                        if(learning_state == sale_state):
                            if(learning_category == sale_category):
                                sale['count'] = item['COUNT']

final_file.write(sales_data)