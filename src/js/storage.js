let storage = {
  set: (key, value) => {
    window.localStorage.setItem(key, JSON.stringify({d:value}));
  },
  get: (key) => {
    let d = window.localStorage.getItem(key);
    if(d) {
      return JSON.parse(d).d;
    }
  },
  push: (key, value) => {
    let d = storage.get(key);
    if(!d) {
      d = [];
    }
    d.push(value);
    storage.set(key, d);
  },
  update: (key, id, value) => {
    let all = storage.get(key);
    for(let i=0;i<all.length;i++) {
      if(all[i].id == id) {
        all[i] = value;
        storage.set(key, all);
        return true;
      }
    }

    return false;
  },
  updateField: (key, id, field, value) => {
    let all = storage.get(key);
    for(let i=0;i<all.length;i++) {
      if(all[i].id == id) {
        all[i][field] = value;
        storage.set(key, all);
        return true;
      }
    }

    return false;
  },
  search: () => {

  }
};

export default storage;
