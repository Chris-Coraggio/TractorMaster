import json

with open("./learning_data.json", "w+") as final_file:
    with open("../purchaseStats.json", "r") as f:
        learning_data = json.load(f)
    with open("../pdata.json", "r") as f:
        p_data = json.load(f)
    with open("../tdata.json", "r") as f:
        t_data = json.load(f)
    with open("../seasonal_sales.json", "r") as f:
        sales_data = json.load(f)

    data = {}

    for row in p_data:
        state = row['state']
        date = row['date']
        value = row['value']
        if data.has_key(state):
            data[state][date] = {
                'prec': value
            }
        else:
            data[state] = {
                date: {
                    'prec': value
                }
            }
    for row in t_data:
        state = row['state']
        date = row['date']
        value = row['value']
        try:
            data[state][date]['temp'] = value
        except:
            continue
    final_file.write("[")
    for item in learning_data:
        try:
            date = item['DATE']
            state = item['STATE']
            category = item['CATEGORY']
            count = item['COUNT']
            obj = {
                'date': date,
                'state': state,
                'category': category,
                'count': count,
                'temp': data[state][date]['temp'],
                'prec': data[state][date]['prec']
            }
            json.dump(obj, final_file)
            final_file.write(",\n")
        except:
            continue
    final_file.write("]")