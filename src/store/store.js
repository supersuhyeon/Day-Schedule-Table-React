import {atom} from 'recoil'

const localStorageEffect = key => ({setSelf, onSet}) => {
    const savedValue = localStorage.getItem(key)
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }
  
    onSet((newValue, _, isReset) => {
    
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };
  

export const timeTableState = atom({
    key: 'timeTableState',
    default : {
        mon: [{
            start:9,
            end:10,
            name:"coding",
            color: "#3843d0",
            id:1
        }],
        tue: [{
            start:11,
            end:12,
            name:"CS",
            color: "#15006D",
            id:2
        }],
        wed: [{
            start:13,
            end:14,
            name:"workingout",
            color: "#8FA1FF",
            id:3
        }],
        thu: [{
            start:15,
            end:16,
            name:"reading",
            color: "#FFC466",
            id:4
        }],
        fri: [{
            start:17,
            end:18,
            name:"thinking",
            color: "#F9623E",
            id:5
        }],
        sat: [{
            start:9,
            end:15,
            name:"checking",
            color: "#FF81A9",
            id:6
        }],
        sun: [{
            start:12,
            end:14,
            name:"studying",
            color: "#8E5AFF",
            id:7
        }]
    },
    effects: [
        localStorageEffect('timeTable'),
      ]

})