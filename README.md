## Work Schedule

![ezgif com-crop (9)](https://user-images.githubusercontent.com/94214512/222823263-b1a5df12-755a-41e9-a201-5dd60c248924.gif) <br>
This is a weekly work schedule app that you can create, read, update, and delete.

### Goals of the project

1. Make a dynamic table using react material-ui
2. Manage form inputs, validate user input and form state using react hook form
3. Manage the state using recoil

### Languages

React, Recoil

### Features

1. Make a dynamic table and pop-up window with [Material-UI library](https://mui.com/material-ui/getting-started/overview/). <br>
   ![worktable](https://user-images.githubusercontent.com/94214512/222845331-1464601e-f1a3-45d8-b5c9-36f3db592cdb.jpg)
   ![dialog](https://user-images.githubusercontent.com/94214512/222877689-b3bec939-5d5d-4a5a-9502-f7941692ec83.jpg)

   I installed 2 packages provided by Material-UI library

- @mui/material provides the main set of React components that follow material design guidelines. It includes components like Button, TextField, Grid, and many more. This package is the core of the Material-UI library.
- @mui/icons-material provides a set of material design icons as React components.

```js
//...codes
return (
  <>
    <TableContainer ref={screenRef}>
      <Typography>Work schedule</Typography>
      <Button
        endIcon={<FileDownloadIcon></FileDownloadIcon>}
        onClick={handleCaptureClick}
      >
        download
      </Button>
      <Button
        endIcon={<AddBoxIcon></AddBoxIcon>}
        onClick={() => {
          return setShowModal(true);
        }}
      >
        add new event
      </Button>
      <MyTable>
        <TableHead>
          <TableRow>
            <TableCell align="center" width={100}>
              Time
            </TableCell>
            <TableCell align="center" width={200}>
              Mon
            </TableCell>
            // ..codes(mon-sun)
          </TableRow>
        </TableHead>
        <TableBody>
          {hourData.map((time, index) => {
            return (
              <TableRow key={index}>
                <TableCell align="center">{`${time}:00 - ${
                  time + 1
                }:00`}</TableCell>
                <TimeTableRow timeNum={time} Edit={Edit}></TimeTableRow>
              </TableRow>
            );
          })}
        </TableBody>
      </MyTable>
    </TableContainer>
  </>
);
```

2. Add and edit event function
   ![제목-없음-5](https://user-images.githubusercontent.com/94214512/222884386-902afe0c-08a1-4c7c-9578-b65ca3b2ebb6.jpg)

- when a user clicks the add new event or edit icon to revise, the user will use the same InputModal component but the component will have different default values.

```js
//TimeTableCell.jsx
export default function TimeTableCell({ day, timeNum, Edit }) {
  const handleEdit = useCallback(() => {
    //when a user clicks an edit icon in an existing event table, it will send the corresponding day and id values to the Edit function and execute
    return Edit(day, timeData.id);
  }, [Edit, day, timeData?.id]);
  return (
    <>
      {timeData?.start === timeNum ? (
        <TableCell
          style={{ backgroundColor: timeData.color, position: "relative" }}
          align="center"
          rowSpan={timeData.end - timeData.start}
          onMouseOver={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {timeData.name}
          {hover ? (
            <div style={{ position: "absolute", top: 5, right: 5 }}>
              <EditIcon
                style={{ cursor: "pointer" }}
                onClick={handleEdit}
              ></EditIcon>
              <DeleteIcon
                style={{ cursor: "pointer" }}
                onClick={handleConfirm}
              ></DeleteIcon>
            </div>
          ) : null}
        </TableCell>
      ) : timeData?.start < timeNum && timeNum < timeData?.end ? null : (
        <TableCell></TableCell>
      )}
    </>
  );
}
```

```js
//TimeTable.jsx
function TimeTable() {
  const timeTableData = useRecoilValue(timeTableState);
  const [editInfo, setEditInfo] = useState({});
  const Edit = useCallback(
    (day, id) => {
      const { start, end, name, color } = timeTableData[day].find(
        // find the matching data according to the parameter day passed through the Edit function
        (planInfo) => {
          return planInfo.id === id;
        }
      );
      setEditInfo({
        //create a new object and save information (which needs to be edited) in editInfo
        dayData: day,
        startTimeData: start,
        endTimeData: end,
        planNameData: name,
        planColorData: color,
        idNum: id,
      });
      setShowModal(true); //show the pop-up window
    },
    [timeTableData]
  );

  return (
    <>
      <TableContainer>//...codes</TableContainer>
      <InputModal
        showModal={showModal}
        handleClose={handleClose}
        {...editInfo} // send information in editInfo to the InputModal pop-up window
      ></InputModal>
    </>
  );
}

export default TimeTable;
```

```js
//InputModal.jsx
export default function InputModal({
  showModal,
  handleClose,
  //so that when the user clicks the add new event button then the default values below will be assigned,
  //however, when they click the edit button then the edit information will be passed through and assigned
  dayData = "mon",
  startTimeData = 9,
  endTimeData = 10,
  planNameData = "",
  planColorData = "#d32f2f",
  idNum,
}) {
  const {
    formState: { errors },
    control,
    getValues,
    handleSubmit,
    reset,
  } = useForm();
  const [timeTableData, setTimeTableData] = useRecoilState(timeTableState);

  useEffect(() => {
    if (showModal) {
      //when the pop-up window is opened
      reset({
        planName: planNameData,
        day: dayData,
        startTime: startTimeData,
        endTime: endTimeData,
        planColor: planColorData,
      });
    }
  }, [
    showModal,
    reset,
    dayData,
    startTimeData,
    endTimeData,
    planNameData,
    planColorData,
  ]);
}
```

- When a user clicks the "add new event" button, fills in the blanks, and clicks the "Add" button, then an ID value is created. However, when it comes to the editing pop-up window, the idNum value is already passed from the TimeTable component as one of the props. Depending on whether idNum exists or not, handleSubmit will execute either an edit or submit function.

```js
const checkOverLap = (A, B) =>
  B.start < A.start ? B.end > A.start : B.start < A.end; //check whether the new event will overlap with an already existing event's time or not

const Submit = useCallback(
  ({ planName, day, startTime, endTime, planColor }) => {
    let valid = true;
    for (let index = 0; index < timeTableData[day].length; index++) {
      if (
        checkOverLap(timeTableData[day][index], {
          start: startTime,
          end: endTime,
        })
      ) {
        valid = false;
        break;
      }
    }
    if (!valid) {
      alert("That time is already booked");
      return;
    }

    const data = {
      // if a new event will not overlap
      start: startTime,
      end: endTime,
      name: planName,
      color: planColor,
      id: uuidv1(), //only after submitting, an id is created and assigned to the new data object
    };

    setTimeTableData((prevtimeData) => {
      return { ...prevtimeData, [day]: [...prevtimeData[day], data] };
    });

    handleClose();
  },
  [timeTableData, setTimeTableData, handleClose]
);

const Edit = useCallback(
  ({ planName, day, startTime, endTime, planColor }) => {
    let valid = true;
    for (let index = 0; index < timeTableData[day].length; index++) {
      if (
        checkOverLap(timeTableData[day][index], {
          start: startTime,
          end: endTime,
        }) &&
        timeTableData[day][index]["id"] !== idNum // if the current data's id in loop does not match up with editInfo's idNum, then show an alert error message
      ) {
        valid = false;
        break;
      }
    }
    if (!valid) {
      alert("That time is already booked");
      return;
    }

    const filteredDayData = [
      ...timeTableData[dayData].filter((data) => data.id !== idNum),
    ]; //a new array filteredDayData is created by filtering out the event data with a matching idNum from the existing array of events for that day (timeTableData[dayData])
    const newTimeTableData = {
      ...timeTableData,
      [dayData]: filteredDayData, //creates a new object by spreading the existing timeTableData object and replacing the day data for the day being edited with the filtered data from above
    };
    const newDayData = [
      //a new array newDayData is created by spreading the new day data for the day being edited from newTimeTableData and appending a new object with the edited data
      ...newTimeTableData[day],
      {
        start: startTime,
        end: endTime,
        id: idNum,
        name: planName,
        color: planColor,
      },
    ];

    setTimeTableData({
      //setTimeTableData updates the timeTableData state by copying the updated newTimeTableData object and replacing the event data for the specific day with the newDayData array
      ...newTimeTableData,
      [day]: newDayData,
    });

    handleClose();
  },
  [dayData, handleClose, idNum, setTimeTableData, timeTableData]
);

return (
  // 모달창
  <Dialog open={showModal} onClose={handleClose}>
    <form onSubmit={handleSubmit(idNum ? Edit : Submit)}>
      <DialogTitle style={{ fontFamily: "Montserrat" }}>
        Add New Event
      </DialogTitle>
      <DialogContent style={{ width: "400px" }}>//...codes</DialogContent>
      <DialogActions>
        <Button style={{ fontFamily: "Montserrat" }} onClick={handleClose}>
          Cancel
        </Button>
        <Button style={{ fontFamily: "Montserrat" }} type="submit">
          Add
        </Button>
      </DialogActions>
    </form>
  </Dialog>
);
```

3. Manage form inputs, validate user input and form state using react hook form<br>

- Controller : a wrapper component for controlled inputs. It provides a way to connect inputs to the useForm hook's state and validation logic, allowing you to easily manage the state and validation of your form inputs.

- formState: this is an object that contains various properties related to the state of the form, such as whether the form is currently submitting or whether there are any errors. The errors property of formState is an object that contains validation errors for each field in the form.

- control: the control object allows you to easily update their values, perform validation checks, and retrieve information about their state. Some of the key properties of the "control" object include the input's name, value, onChange and onBlur functions, and ref, as well as various methods for managing validation.

- getValues: this is a function provided by the react-hook-form library that returns an object containing the current values of all the form inputs registered with the control prop.

- handleSubmit: this is a function provided by the react-hook-form library that you can use to handle form submissions. You can pass this function as the onSubmit prop to your form component, and it will be called when the user submits the form.

- reset: this is a function provided by the react-hook-form library that you can use to reset the form to its initial state.

```js
<Controller
  control={control}
  name="endTime" // This prop is passed the name of the field in the form data object that this input will be associated with.
  rules={{
    //validation rules
    required: true, //the field is required and must be filled in.
    validate: (value) => getValues("startTime") < value, //this function checks whether the "endTime" value is greater than the "startTime" value. If the "endTime" value is invalid, it returns an error message. (You can access the value of the current field through the value parameter, and you use the getValues ​​function to refer to the value of another field)
  }}
  render={({ field }) => {
    return (
      <TextField
        {...field}
        select
        error={!!errors.endTime}
        style={{ marginTop: "30px", width: "350px" }}
        label="Ends"
        placeholder="select ending time"
      >
        {timeOptions.map((option) => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          );
        })}
      </TextField>
    );
  }}
></Controller>;
//These below indicates the type of error encountered during the validation rule for the endTime field in the errors object
{
  errors.endTime?.type === "required" && (
    <p style={{ color: "#d32f2f", fontFamily: "Montserrat" }}>
      select end time
    </p>
  );
}
{
  errors.endTime?.type === "validate" && (
    <p style={{ color: "#d32f2f", fontFamily: "Montserrat" }}>
      please check start time and end time again
    </p>
  );
}
```

So what I understood while reading this official documentation is that the control object passed through the control prop in the Controller component collects all the information about the form, including the name, rules, and render defined in each Controller component. This collected information can be accessed in the handleSubmit function without using the register function, by iterating through each field and using the name prop of each field as the key and the user input value as the value, and combining them into an object to be passed when the form is submitted.

4. Manage the state using recoil<br>
   Recoil uses a concept called atoms to manage state. An atom is essentially a piece of state that can be used across multiple components in a React application. Atoms can be updated and accessed from any component, making it easier to manage global state.

   - how to install

   ```html
   npm install recoil
   ```

   - Initialize the Recoil state using the RecoilRoot component

   ```js
   import React from "react";
   import { RecoilRoot } from "recoil";
   import MyComponent from "./MyComponent";

   function App() {
     return (
       <RecoilRoot>
         <MyComponent />
       </RecoilRoot>
     );
   }

   export default App;
   ```

   - Creating a Recoil state: Create a Recoil state using the atom function.

   ```js
   import { atom } from "recoil";

   export const timeTableState = atom({
     key: "timeTableState",
     default: {
       mon: [
         {
           start: 9,
           end: 10,
           name: "coding",
           color: "#3843d0",
           id: 1,
         },
       ],
     },
   });
   ```

   - Use Recoil state: Use the useRecoilState or useRecoilValue hook to consume the Recoil state. useRecoilState is used to get and set the current value of the Recoil state. useRecoilValue is used to get the current value of the Recoil state.

   ```js
   import { useRecoilValue } from "recoil";
   const timeTableData = useRecoilValue(timeTableState);
   ```

   ```js
   import { useRecoilState } from "recoil";
   const [timeTableData, setTimeTableData] = useRecoilState(timeTableState);
   ```

### Reference Links

[react material UI library](https://mui.com/material-ui/react-stack/)<br>
[recoil](https://recoiljs.org/docs/guides/atom-effects)<br>
[useForm](https://react-hook-form.com/api/useform/)<br>

### Self-reflection

I didn't have many chances to use a state management library like Redux or mobX because using useContext hook was enough for my projects. But after reading that recoil is easy to understand and more simple and flexible than redux, I wanted to try it out. Recoil was really designed to be easy-to-use and I think that it's good for developers who are new to React or state management like me. I was satisfied with it overall. Though for upcoming projects I am planning to test out Redux or mobX due to the fact that these are the most popular external libraries. After trying those libraries out I will be able to make comparisons. Making a time table is always confusing and complicated. I have no idea how many times I drew tables with a pen in my notebook. But it was a great experience to handle inputs and a UI library.
