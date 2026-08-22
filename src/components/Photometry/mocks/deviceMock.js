const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const SAMPLE_CONFIGURATION = {
  SAMPLE_CONFIGURATION: {
    SAMPLE_AVAILABLE_COUNT: 4,
    SAMPLES: {
      S_1: { SAMPLE_ID: 1324, SAMPLE_NAME: 'FACTORY', CREATE_DATE_TIME: '2026-08-14T12:00:00Z', USER_ID: 'USER@123', USER_NAME: 'John Doe' },
      S_2: { SAMPLE_ID: 4321, SAMPLE_NAME: 'LAB_A', CREATE_DATE_TIME: '2026-08-14T12:15:00Z', USER_ID: 'ADMIN', USER_NAME: 'System Admin' },
      S_3: { SAMPLE_ID: 9999, SAMPLE_NAME: 'FIELD_TEST', CREATE_DATE_TIME: '2026-08-14T14:30:00Z', USER_ID: 'USER_03', USER_NAME: 'Jane Doe' },
      S_4: { SAMPLE_ID: 5555, SAMPLE_NAME: 'WATER_PLANT_B', CREATE_DATE_TIME: '2026-08-14T16:00:00Z', USER_ID: 'OPERATOR_1', USER_NAME: 'Alex Rivera' },
    },
  },
}

const generateMockLists = (sampleId) => {
  const strId = String(sampleId || '')
  if (strId === '1324') return {
    L_1: { PARM_NAME: 'PH', PARM_VALUE: (7.2 + Math.random() * 0.4).toFixed(2), CREATE_DATE_TIME: new Date().toISOString(), STATUS: 'NORMAL' },
    L_2: { PARM_NAME: 'TDS', PARM_VALUE: (250 + Math.random() * 20).toFixed(0), CREATE_DATE_TIME: new Date().toISOString(), STATUS: 'NORMAL' },
    L_3: { PARM_NAME: 'CONDUCTIVITY', PARM_VALUE: (1.25 + Math.random() * 0.1).toFixed(2), CREATE_DATE_TIME: new Date().toISOString(), STATUS: 'HIGH' },
  }
  return {
    L_1: { PARM_NAME: 'PH', PARM_VALUE: (7.45 + Math.random() * 0.2).toFixed(2), CREATE_DATE_TIME: new Date().toISOString(), STATUS: 'NORMAL' },
    L_2: { PARM_NAME: 'ORP', PARM_VALUE: (195 + Math.random() * 25).toFixed(0), CREATE_DATE_TIME: new Date().toISOString(), STATUS: 'NORMAL' },
    L_3: { PARM_NAME: 'TURBIDITY', PARM_VALUE: (1.2 + Math.random() * 0.3).toFixed(2), CREATE_DATE_TIME: new Date().toISOString(), STATUS: 'LOW' },
    L_4: { PARM_NAME: 'DO', PARM_VALUE: (6.5 + Math.random() * 0.5).toFixed(1), CREATE_DATE_TIME: new Date().toISOString(), STATUS: 'NORMAL' },
  }
}

export const deviceMock = {
  async getSampleConfiguration() {
    await delay(120)
    return JSON.parse(JSON.stringify(SAMPLE_CONFIGURATION))
  },

  async getLiveData(sampleId) {
    await delay(200)
    const lists = generateMockLists(sampleId)
    return {
      DEVICE: 'LOVIBOND_SENSOR',
      SELECTED_SAMPLE_ID: String(sampleId || ''),
      LIVE_DATA: {
        UPPER_DIS: `PH ${(6.30 + Math.random() * 0.1).toFixed(2)}`,
        LOWER_DIS: `TEMP :${(37 + Math.random() * 2).toFixed(0)} C`,
        DEVICE_STATUS: 'CONNECTED',
        DEVICE_LAST_SYNC: new Date().toISOString(),
      },
      LIST_COUNT: Object.keys(lists).length,
      LISTS: lists,
    }
  },
}
