import json

with open(r"./all_data.json", "w+") as final_file:
    with open("./learningData.json", "r") as f:
        learning_data = json.load(f)
    with open("./pdata.json", "r") as f:
        p_data = json.load(f)
    with open("./tdata.json", "r") as f:
        t_data = json.load(f)

    p_map = {}
    t_map = {}
    l_map = {}

    print("Here we go!")

    for p in p_data:
        p_date = p['date']
        p_state = p['state']
        p_map[(p_date, p_state)] = p['value']
    
    print("Done with p!")
    
    for t in t_data:
        t_date = t['date']
        t_state = t['state']
        t_map[(t_date, t_state)] = t['value']

    print("Done with t!")
    
    for l in learning_data:
        learning_date = l['DATE']
        learning_state = l['STATE']
        l['precip'] = p_map[(p_date, p_state)]
        l['temp'] = t_map[(t_date, t_state)]

    print("Done with l!")

    final_file.write(str(learning_data).replace("'", "\""))