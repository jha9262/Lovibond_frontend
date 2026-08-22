export const initialFormState = {
    // formData: {
    //   // dataCollectorSSID:"",
    //   // dataCollectorPassword:"",
    //   dataCollectorName: "",
    //   // dataCollectorBatchId: "",
    //   // noOfDevices: "",
    //   baudRate: "",
    //   parity: "",
    //   // dataStorageLogRate: "",
    //   dataBits:"",
    //   dataStorageCount: "",
    //   stopBits: "",
    //   // dataScanRate: "",  
    //   // dataLength: "",
    //   protocol:"",
    //   // macAddress:"",
    //   // serialNo:"",
    //   // wifiSSID:"",
    //   // wifiPassword:""
    // },

    formData: {
      dataCollectorName: "",
      baudRate: "",
      parity: "",
      dataBits:"",
      dataStorageCount: "",
      stopBits: "",
      scanRate:"",
      protocol:"",
    },
    formErrors: {},
  };
  
  export const formReducer = (state, action) => {
    switch (action.type) {
      case "UPDATE_FIELD": {
        const { field, value } = action.payload;
        let error = "";


        if(action.payload.value.length>20){
            return { 
                ...state,
                formErrors: { 
                  ...state.formErrors, 
                  [action.payload.field]: "MAX 20 CHARACTERS ALLOWED" 
                } 
              };
        }
  
        return {
          ...state,
          formData: {
            ...state.formData,
            [field]: value,
          },
          formErrors: {
            ...state.formErrors,
            [field]: error,
          },
        };
      }
      case "SET_FORM_DATA":
        return {
          ...state,
          formData: { ...state.formData, ...action.payload },
        };
      case "SET_ERRORS":
        return {
          ...state,
          formErrors: { ...action.payload },
        };
      default:
        return state;
    }
  };
  