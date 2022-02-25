import glob, json,tqdm,pprint,os

if __name__ == "__main__":

    files = glob.glob("./database/tsumego/*/*/*.json")
    c=0
    f_with_i = []
    for f in tqdm.tqdm(files):
        with open(f) as fo:
            data = json.load(fo)
        i_is_in = sum(map(lambda x: 'i' in x ,data['AB'])) + sum(map(lambda x: 'i' in x ,data['AW'])) + sum(map(lambda x: 'i' in x ,data['SOL']))
        
        if i_is_in > 0:
            f_with_i.append(''.join(f.split('\\')[1:3]))
            import os
            os.remove(f) 